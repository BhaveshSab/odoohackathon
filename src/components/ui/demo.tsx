import AuthSwitch from "./auth-switch";

export default function Demo() {
  return (
    <AuthSwitch
      defaultMode="signin"
      onSubmit={(data) =>
        console.log(`${data.mode} submit:`, {
          email: data.email,
          name: data.name,
        })
      }
    />
  );
}
