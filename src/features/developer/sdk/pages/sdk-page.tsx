import { SdkSectionNav } from "@/features/developer/sdk/components/sdk-section-nav";
import { SdkOverviewSection } from "@/features/developer/sdk/components/sdk-overview-section";
import { InstallationSection } from "@/features/developer/sdk/components/installation-section";
import { ConfigurationSection } from "@/features/developer/sdk/components/configuration-section";
import { ApiCredentialsSection } from "@/features/developer/sdk/components/api-credentials-section";
import { FrameworkGuidesSection } from "@/features/developer/sdk/components/framework-guides-section";
import { CodeExamplesSection } from "@/features/developer/sdk/components/code-examples-section";
import { PlaygroundSection } from "@/features/developer/sdk/components/playground-section";
import { DownloadsSection } from "@/features/developer/sdk/components/downloads-section";
import { DocumentationSection } from "@/features/developer/sdk/components/documentation-section";
import { SupportBanner } from "@/features/developer/sdk/components/support-banner";

export default function SdkPage() {
  return (
    <div className="flex flex-col gap-6">
      <div id="overview">
        <h1 className="text-2xl font-semibold">SDK</h1>
        <p className="text-sm text-muted-foreground">
          Integrate Aegis into your application in minutes.
        </p>
      </div>

      <SdkSectionNav />

      <div className="flex flex-col gap-6 pt-2">
        <SdkOverviewSection />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InstallationSection />
          <ConfigurationSection />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ApiCredentialsSection />
          <FrameworkGuidesSection />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CodeExamplesSection />
          <PlaygroundSection />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DownloadsSection />
          <DocumentationSection />
        </div>

        <SupportBanner />
      </div>
    </div>
  );
}