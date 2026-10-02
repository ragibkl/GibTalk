import { useEffect, useMemo, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  FALLBACK_NAMES,
  languageName,
  openAddVoice,
  useDeviceLanguages,
} from "../service/languages";
import { Language } from "../service/speech";

const ADD_LANGUAGE = "__add_language__";

// Languages come from the voices on the device, never a fixed list.
const FALLBACK = ["en", "ms", "id", "zh", "ta", "te"];

type Props = {
  language: Language;
  onChangeLanguage(language: Language): void;
};

export default function LanguagePicker(props: Props) {
  const { installed } = useDeviceLanguages();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(props.language);
  const [currentName, setCurrentName] = useState(props.language);
  const insets = useSafeAreaInsets();

  const isInstalled = installed.some((l) => l.code === value);

  useEffect(() => {
    languageName(value).then(setCurrentName);
  }, [value]);

  const items = useMemo(() => {
    const languages = installed.length
      ? installed.map((l) => ({
          label: l.name === l.localName ? l.name : `${l.name} (${l.localName})`,
          value: l.code,
        }))
      : FALLBACK.map((code) => ({ label: FALLBACK_NAMES[code], value: code }));

    return [
      ...(installed.length && !isInstalled
        ? [{ label: `${currentName}: no voice on this device`, value }]
        : []),
      ...languages,
      { label: "Add a language…", value: ADD_LANGUAGE },
    ];
  }, [installed, isInstalled, currentName, value]);

  const onChangeValue = (next: string | null) => {
    if (next === ADD_LANGUAGE) {
      setValue(props.language);
      openAddVoice();
      return;
    }
    props.onChangeLanguage(next || props.language);
  };

  return (
    <DropDownPicker
      items={items}
      open={open}
      value={value}
      setOpen={setOpen}
      setValue={setValue}
      onChangeValue={onChangeValue}
      // A full-screen list: in landscape the dropdown opened under the
      // status bar and hid the first languages.
      listMode="MODAL"
      modalTitle="Language"
      // The app draws edge to edge, so keep the list clear of the system bars.
      modalContentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    />
  );
}
