import React, { useEffect, useRef, useState } from "react";

type SvgComponent = React.FC<React.SVGProps<SVGSVGElement>>;
type SvgModule = {
  ReactComponent: SvgComponent;
};

export function useDynamicSvgImport(iconName: string) {
  const importedIconRef = useRef<SvgComponent>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    setLoading(true);

    const importSvgIcon = async (): Promise<void> => {
      try {
        const imported = (await import(
          `../../assets/svg/${iconName}.svg`
        )) as unknown as SvgModule;
        importedIconRef.current = imported.ReactComponent;
      } catch (err) {
        setError(err);

        try {
          const imported = (await import(
            `../../assets/svg/error.svg`
          )) as unknown as SvgModule;
          importedIconRef.current = imported.ReactComponent;
        } catch (errorSvgError) {
          setError(errorSvgError);
        }
      } finally {
        setLoading(false);
      }
    };

    importSvgIcon();
  }, [iconName]);

  return { error, loading, SvgIcon: importedIconRef.current };
}
