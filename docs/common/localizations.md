# Localization of Syncfusion code components

The localization feature in Syncfusion code components allows you to customize the display language of the component according to your preferences. Here's a detailed guide on how to localize Syncfusion code components:

## Add `ej2-locale` package:

Begin by adding the `ej2-locale` package to your project. For that, navigate to the code components folder and execute the following command:

```bash
npm install @syncfusion/ej2-locale --save
```

For instance, if you want to localize the Grid component, run this command in the [components/grids/](../../components/grids/) folder.

## Copy `locale.tsx` file:

Copy the `locale.tsx` file from the [components/common/](../../components/common/locale.tsx) folder to your desired code components folder.

For example, copy the `locale.tsx` file from the [components/common/](../../components/common/locale.tsx) folder to the [components/grids/SfGrid/](../../components/grids/SfGrid/) to localize Grid code component.

## Update the `locale.tsx` file:

Modify the `locale.tsx` file with the necessary locale values according to your localization requirements.

## Add imports in the `index.tsx` file:

Include the following imports in the `index.tsx` file of the code component.

```tsx
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { IUserSettings } from "./types";
import Locale from "./locale";
```

## Add locale setting function:

Insert the following function in the `index.tsx` file to set the locale for the code component.

```tsx
    /**
     * Sets the locale for the code component.
     * If the user's locale is available in the `Locale` object, it loads the corresponding locale and sets the culture.
     * If the user's locale is not available, it defaults to English ("en").
     */
    private setLocale(): void {
        if (!Locale) return;

        const userSettings = this.context.userSettings as IUserSettings;
        const culture: string | undefined = userSettings?.locale;

        const preferredLocalePrefix: string = culture?.split('-')[0] ?? 'en';
        const localeKeys: string[] = Object.keys(Locale);

        const localeKey = localeKeys.find(key => key.startsWith(preferredLocalePrefix)) as keyof typeof Locale;

        if (localeKey && Locale[localeKey]) {
            const selectedLocale = { [localeKey]: Locale[localeKey] };
            L10n.load(selectedLocale);
            setCulture(String(localeKey));
        }
    }
```

## Invoke the `setLocale` function:

Call the `setLocale` function within the `updateView` function to apply the locale settings:

```tsx
this.setLocale();
```

## Update locale based on PowerApps application locale:

Once implemented, the locale values will be automatically updated based on the PowerApps application locale.

> [!NOTE]
> For a list of supported localization languages, refer to the [ej2-locale repository](https://github.com/syncfusion/ej2-locale?tab=readme-ov-file#currently-supported-localization-languages).
