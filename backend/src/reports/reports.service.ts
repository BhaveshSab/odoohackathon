import { Injectable } from '@nestjs/common';
import {
  AllocationStatus,
  AssetStatus,
  BookingStatus,
  MaintenanceStatus,
  Prisma,
  TransferStatus,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

/** Columns exported by GET /reports/export/assets.csv, in order. */
const CSV_COLUMNS = [
  'assetTag',
  'name',
  'category',
  'status',
  'condition',
  'location',
  'serialNumber',
  'acquisitionDate',
  'acquisitionCost',
] as const;

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The dashboard KPI cards. One handler, fanned out with Promise.all so every
   * count/list hits the DB concurrently.
   *
   * `maintenanceToday` is interpreted as "maintenance requests currently
   * IN_PROGRESS" (the actively-worked queue), not "created today".
   */
  async dashboard() {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const overdueWhere: Prisma.AllocationWhereInput = {
      status: AllocationStatus.ACTIVE,
      expectedReturnDate: { lt: now },
    };
    const upcomingWhere: Prisma.AllocationWhereInput = {
      status: AllocationStatus.ACTIVE,
      expectedReturnDate: { gte: now, lte: in7Days },
    };

    const holderSelect = {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      departmentId: true,
    };
    const listInclude: Prisma.AllocationInclude = {
      asset: {
        select: { id: true, assetTag: true, name: true, status: true },
      },
      holderUser: { select: holderSelect },
      department: { select: { id: true, name: true } },
    };

    const [
      assetsAvailable,
      assetsAllocated,
      assetsUnderMaintenance,
      maintenanceToday,
      activeBookings,
      pendingTransfers,
      upcomingReturns,
      overdueReturns,
      overdueList,
      upcomingReturnsList,
    ] = await Promise.all([
      this.prisma.asset.count({ where: { status: AssetStatus.AVAILABLE } }),
      this.prisma.asset.count({ where: { status: AssetStatus.ALLOCATED } }),
      this.prisma.asset.count({
        where: { status: AssetStatus.UNDER_MAINTENANCE },
      }),
      // "Maintenance Today" = requests raised today OR still being worked on.
      this.prisma.maintenanceRequest.count({
        where: {
          OR: [
            { createdAt: { gte: startOfToday } },
            { status: MaintenanceStatus.IN_PROGRESS },
          ],
        },
      }),
      // Bookings never persist ONGOING (it's derived); count by the clock:
      // a non-cancelled booking whose window contains "now".
      this.prisma.booking.count({
        where: {
          status: { not: BookingStatus.CANCELLED },
          startTime: { lte: now },
          endTime: { gt: now },
        },
      }),
      this.prisma.transferRequest.count({
        where: { status: TransferStatus.REQUESTED },
      }),
      this.prisma.allocation.count({ where: upcomingWhere }),
      this.prisma.allocation.count({ where: overdueWhere }),
      this.prisma.allocation.findMany({
        where: overdueWhere,
        include: listInclude,
        orderBy: { expectedReturnDate: 'asc' },
        take: 200,
      }),
      this.prisma.allocation.findMany({
        where: upcomingWhere,
        include: listInclude,
        orderBy: { expectedReturnDate: 'asc' },
        take: 200,
      }),
    ]);

    return {
      assetsAvailable,
      assetsAllocated,
      assetsUnderMaintenance,
      // Maintenance raised today or currently in progress.
      maintenanceToday,
      // Bookings happening right now (window contains the current time).
      activeBookings,
      pendingTransfers,
      upcomingReturns,
      overdueReturns,
      overdueList,
      upcomingReturnsList,
    };
  }

  /**
   * Most-used vs idle assets. Counts every allocation ever made per asset and
   * flags whether the asset is currently allocated (has an ACTIVE allocation).
   */
  async assetUtilization(limit = 50) {
    const take = Math.min(limit, 200);

    const [assets, grouped, activeAllocations] = await Promise.all([
      this.prisma.asset.findMany({
        select: {
          id: true,
          assetTag: true,
          name: true,
          status: true,
          category: { select: { id: true, name: true } },
        },
      }),
      this.prisma.allocation.groupBy({
        by: ['assetId'],
        _count: { _all: true },
      }),
      this.prisma.allocation.findMany({
        where: { status: AllocationStatus.ACTIVE },
        select: { assetId: true },
      }),
    ]);

    const countByAsset = new Map<string, number>();
    for (const g of grouped) {
      countByAsset.set(g.assetId, g._count._all);
    }
    const currentlyAllocated = new Set(
      activeAllocations.map((a) => a.assetId),
    );

    const enriched = assets.map((asset) => ({
      ...asset,
      allocationCount: countByAsset.get(asset.id) ?? 0,
      currentlyAllocated: currentlyAllocated.has(asset.id),
    }));

    const mostUsed = enriched
      .filter((a) => a.allocationCount > 0)
      .sort((a, b) => b.allocationCount - a.allocationCount)
      .slice(0, take);

    const idle = enriched.filter((a) => a.allocationCount === 0);

    return { mostUsed, idle, totalAssets: assets.length };
  }

  /** Maintenance request counts grouped by asset and by category. */
  async maintenanceFrequency() {
    const grouped = await this.prisma.maintenanceRequest.groupBy({
      by: ['assetId'],
      _count: { _all: true },
      orderBy: { _count: { assetId: 'desc' } },
    });

    const assetIds = grouped.map((g) => g.assetId);
    const assets = assetIds.length
      ? await this.prisma.asset.findMany({
          where: { id: { in: assetIds } },
          select: {
            id: true,
            assetTag: true,
            name: true,
            category: { select: { id: true, name: true } },
          },
        })
      : [];
    const assetById = new Map(assets.map((a) => [a.id, a]));

    const byAsset = grouped.map((g) => {
      const asset = assetById.get(g.assetId);
      return {
        assetId: g.assetId,
        assetTag: asset?.assetTag ?? null,
        name: asset?.name ?? null,
        categoryId: asset?.category.id ?? null,
        categoryName: asset?.category.name ?? null,
        count: g._count._all,
      };
    });

    const byCategoryMap = new Map<
      string,
      { categoryId: string; categoryName: string; count: number }
    >();
    for (const row of byAsset) {
      if (!row.categoryId || !row.categoryName) continue;
      const existing = byCategoryMap.get(row.categoryId);
      if (existing) {
        existing.count += row.count;
      } else {
        byCategoryMap.set(row.categoryId, {
          categoryId: row.categoryId,
          categoryName: row.categoryName,
          count: row.count,
        });
      }
    }
    const byCategory = [...byCategoryMap.values()].sort(
      (a, b) => b.count - a.count,
    );

    return { byAsset, byCategory };
  }

  /**
   * Assets "due for maintenance or nearing retirement".
   *
   * Heuristic: an asset qualifies if it has >= 2 maintenance requests OR its
   * acquisitionDate is more than 5 years ago. A `reasons` array on each row
   * spells out which rule(s) matched.
   */
  async dueMaintenance() {
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    const [grouped, agingAssets] = await Promise.all([
      this.prisma.maintenanceRequest.groupBy({
        by: ['assetId'],
        _count: { _all: true },
      }),
      this.prisma.asset.findMany({
        where: { acquisitionDate: { lt: fiveYearsAgo } },
        select: { id: true },
      }),
    ]);

    const frequentIds = new Set(
      grouped.filter((g) => g._count._all >= 2).map((g) => g.assetId),
    );
    const agingIds = new Set(agingAssets.map((a) => a.id));
    const maintenanceCount = new Map(
      grouped.map((g) => [g.assetId, g._count._all]),
    );

    const candidateIds = [...new Set([...frequentIds, ...agingIds])];
    if (candidateIds.length === 0) {
      return { items: [], total: 0 };
    }

    const assets = await this.prisma.asset.findMany({
      where: { id: { in: candidateIds } },
      select: {
        id: true,
        assetTag: true,
        name: true,
        status: true,
        condition: true,
        acquisitionDate: true,
        category: { select: { id: true, name: true } },
      },
    });

    const items = assets.map((asset) => {
      const reasons: string[] = [];
      if (frequentIds.has(asset.id)) reasons.push('FREQUENT_MAINTENANCE');
      if (agingIds.has(asset.id)) reasons.push('AGING_OVER_5_YEARS');
      return {
        ...asset,
        maintenanceCount: maintenanceCount.get(asset.id) ?? 0,
        reasons,
      };
    });

    return { items, total: items.length };
  }

  /**
   * Assets currently allocated, tallied per department two ways:
   *  - byAllocationDepartment: ACTIVE allocations that name a department.
   *  - byHolderDepartment: ACTIVE allocations to a user, counted against that
   *    user's own department.
   */
  async departmentAllocation() {
    const [departments, allocations] = await Promise.all([
      this.prisma.department.findMany({
        select: { id: true, name: true },
      }),
      this.prisma.allocation.findMany({
        where: { status: AllocationStatus.ACTIVE },
        select: {
          departmentId: true,
          holderUser: { select: { departmentId: true } },
        },
      }),
    ]);

    const deptName = new Map(departments.map((d) => [d.id, d.name]));

    const byAllocation = new Map<string, number>();
    const byHolder = new Map<string, number>();
    let unassignedAllocationDept = 0;
    let unassignedHolderDept = 0;

    for (const alloc of allocations) {
      if (alloc.departmentId) {
        byAllocation.set(
          alloc.departmentId,
          (byAllocation.get(alloc.departmentId) ?? 0) + 1,
        );
      } else {
        unassignedAllocationDept += 1;
      }

      const holderDept = alloc.holderUser?.departmentId;
      if (holderDept) {
        byHolder.set(holderDept, (byHolder.get(holderDept) ?? 0) + 1);
      } else {
        unassignedHolderDept += 1;
      }
    }

    const toRows = (map: Map<string, number>) =>
      [...map.entries()]
        .map(([departmentId, count]) => ({
          departmentId,
          departmentName: deptName.get(departmentId) ?? null,
          count,
        }))
        .sort((a, b) => b.count - a.count);

    return {
      byAllocationDepartment: toRows(byAllocation),
      byHolderDepartment: toRows(byHolder),
      unassignedAllocationDept,
      unassignedHolderDept,
      totalActiveAllocations: allocations.length,
    };
  }

  /**
   * Booking heatmap: non-cancelled bookings bucketed by day-of-week (0=Sunday)
   * and hour-of-day (0-23) of their start time. Returns only non-empty cells.
   */
  async bookingHeatmap() {
    const bookings = await this.prisma.booking.findMany({
      where: { status: { not: BookingStatus.CANCELLED } },
      select: { startTime: true },
    });

    const buckets = new Map<string, number>();
    for (const b of bookings) {
      const dayOfWeek = b.startTime.getDay();
      const hour = b.startTime.getHours();
      const key = `${dayOfWeek}-${hour}`;
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }

    const cells = [...buckets.entries()]
      .map(([key, count]) => {
        const [dayOfWeek, hour] = key.split('-').map(Number);
        return { dayOfWeek, hour, count };
      })
      .sort((a, b) =>
        a.dayOfWeek === b.dayOfWeek
          ? a.hour - b.hour
          : a.dayOfWeek - b.dayOfWeek,
      );

    return { cells, total: bookings.length };
  }

  /** Builds the asset list as a CSV string (no external lib). */
  async assetsCsv(): Promise<string> {
    const assets = await this.prisma.asset.findMany({
      orderBy: { assetTag: 'asc' },
      select: {
        assetTag: true,
        name: true,
        status: true,
        condition: true,
        location: true,
        serialNumber: true,
        acquisitionDate: true,
        acquisitionCost: true,
        category: { select: { name: true } },
      },
    });

    const header = CSV_COLUMNS.join(',');
    const rows = assets.map((a) =>
      [
        a.assetTag,
        a.name,
        a.category?.name ?? '',
        a.status,
        a.condition,
        a.location ?? '',
        a.serialNumber ?? '',
        a.acquisitionDate ? a.acquisitionDate.toISOString() : '',
        a.acquisitionCost != null ? a.acquisitionCost.toString() : '',
      ]
        .map((v) => this.csvEscape(v))
        .join(','),
    );

    return [header, ...rows].join('\r\n');
  }

  /** RFC-4180 style escaping: wrap in quotes when the value has , " or newline. */
  private csvEscape(value: string): string {
    if (/[",\r\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
