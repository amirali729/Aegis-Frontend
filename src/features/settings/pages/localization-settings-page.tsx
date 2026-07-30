import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { usePreferencesStore } from "@/shared/timezone/preferences";
import {
  SUPPORTED_LOCALES,
  SUPPORTED_TIMEZONES,
} from "@/shared/constants/localization";
import { useFormattedDateTime } from "@/shared/timezone/format";

export default function LocalizationSettingsPage() {
  const { timezone, locale, setTimezone, setLocale } = usePreferencesStore();
  const preview = useFormattedDateTime(new Date().toISOString());

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Localization</h1>
        <p className="text-sm text-muted-foreground">
          Every timestamp in Aegis is stored in UTC and converted to your
          preferences below for display.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timezone & language</CardTitle>
          <CardDescription>
            Right now it would show as{" "}
            <span className="font-medium text-foreground">
              {preview.dateTime}
            </span>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:max-w-sm">
          <div className="grid gap-2">
            <Label>Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Locale</Label>
            <Select value={locale} onValueChange={setLocale}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LOCALES.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}