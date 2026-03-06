import TestInterfaceClient from "./TestInterfaceClient";

export default async function TestInterfacePage({ params }: { params: Promise<{ testSessionId: string }> }) {
    const { testSessionId } = await params;
    return <TestInterfaceClient testId={testSessionId} />;
}
