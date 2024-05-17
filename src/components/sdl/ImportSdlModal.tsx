"use client";
import { ReactNode, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Timer } from "@src/utils/timer";
import { importSimpleSdl } from "@src/utils/sdl/sdlImport";
import { UseFormSetValue } from "react-hook-form";
import { SdlBuilderFormValues, Service } from "@src/types";
import { event } from "nextjs-google-analytics";
import { AnalyticsEvents } from "@src/utils/analytics";
import { Popup } from "@src/components/shared/Popup";
import { useTheme } from "next-themes";
import { ArrowDown } from "iconoir-react";
import { Alert } from "@src/components/ui/alert";
import { useSnackbar } from "notistack";
import { Snackbar } from "../shared/Snackbar";

type Props = {
  setValue: UseFormSetValue<SdlBuilderFormValues>;
  onClose: () => void;
  children?: ReactNode;
};

export const ImportSdlModal: React.FunctionComponent<Props> = ({ onClose, setValue }) => {
  const [sdl, setSdl] = useState<string | undefined>("");
  const [parsingError, setParsingError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const timer = Timer(500);

    timer.start().then(() => {
      createAndValidateSdl(sdl || "");
    });

    return () => {
      if (timer) {
        timer.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdl]);

  const createAndValidateSdl = (yamlStr: string) => {
    try {
      if (!yamlStr) return null;

      const services = importSimpleSdl(yamlStr);

      setParsingError(null);

      return services;
    } catch (err) {
      if (err.name === "YAMLException" || err.name === "CustomValidationError") {
        setParsingError(err.message);
      } else if (err.name === "TemplateValidation") {
        setParsingError(err.message);
      } else {
        setParsingError("Error while parsing SDL file");
        // setParsingError(err.message);
        console.error(err);
      }
    }
  };

  const onImport = () => {
    const result = createAndValidateSdl(sdl || "");
    console.log(result);

    if (!result) return;

    setValue("services", result as Service[]);

    enqueueSnackbar(<Snackbar title="Import success!" iconVariant="success" />, {
      variant: "success",
      autoHideDuration: 4000
    });

    event(AnalyticsEvents.IMPORT_SDL, {
      category: "sdl_builder",
      label: "Import SDL"
    });

    onClose();
  };

  return (
    <Popup
      fullWidth
      open={true}
      variant="custom"
      title="Import SDL"
      actions={[
        {
          label: "Close",
          color: "primary",
          variant: "text",
          side: "left",
          onClick: onClose
        },
        {
          label: "Import",
          color: "secondary",
          variant: "default",
          side: "right",
          disabled: !sdl || !!parsingError,
          onClick: onImport
        }
      ]}
      onClose={onClose}
      maxWidth="md"
      enableCloseOnBackdropClick
    >
      <h6 className="mb-4 flex items-center text-muted-foreground">
        Paste your sdl here to import <ArrowDown className="ml-4 text-sm" />
      </h6>
      <div className="mb-2">
        <Editor height="500px" defaultLanguage="yaml" value={sdl} onChange={value => setSdl(value)} theme={resolvedTheme === "dark" ? "vs-dark" : "light"} />
      </div>
      {parsingError && (
        <Alert className="mt-4" variant="destructive">
          {parsingError}
        </Alert>
      )}
    </Popup>
  );
};
