import React, { useEffect, useRef, useState } from "react";

export function useDynamicSvgImport(iconName: string) {
  const importedIconRef = useRef<React.FC<React.SVGProps<SVGElement>>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    setLoading(true);
    // dynamically import the mentioned svg icon name in props
    const importSvgIcon = async (): Promise<void> => {
      // please make sure all your svg icons are placed in the same directory
      // if we want that part to be configurable then instead of iconName we will send iconPath as prop
      try {
        importedIconRef.current = (
          await import(`../../assets/svg/${iconName}.svg`)
        ).ReactComponent; // svgr provides ReactComponent for given svg path
      } catch (err) {
        setError(err);
        // console.error(err);
        // Assuming you have an error.svg file in your assets directory
        try {
          const imported: any = await import(`../../assets/svg/error.svg`);

          importedIconRef.current = imported.ReactComponent;
        } catch (errorSvgError) {
          // If error.svg is also missing or invalid, you can handle it here
          setError(errorSvgError);
          // console.error(errorSvgError);
        }
      } finally {
        setLoading(false);
      }
    };

    importSvgIcon();
  }, [iconName]);

  return { error, loading, SvgIcon: importedIconRef.current };
}
