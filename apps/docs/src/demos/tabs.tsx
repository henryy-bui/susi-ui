import { Tabs, TabsContent, TabsList, TabsTrigger } from '@susi-ui/react';

export default function TabsDemo() {
  return (
    <Tabs defaultValue="account" style={{ width: '100%' }}>
      <TabsList className="susi-tabs-list">
        <TabsTrigger className="susi-tab" value="account">
          Account
        </TabsTrigger>
        <TabsTrigger className="susi-tab" value="password">
          Password
        </TabsTrigger>
        <TabsTrigger className="susi-tab" value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>

      <TabsContent className="susi-tab-content" value="account">
        Arrow keys move between tabs and select as they go.
      </TabsContent>
      <TabsContent className="susi-tab-content" value="password">
        Pass activationMode="manual" to require Enter or Space instead.
      </TabsContent>
      <TabsContent className="susi-tab-content" value="billing">
        Disabled tabs are skipped by the keyboard.
      </TabsContent>
    </Tabs>
  );
}
