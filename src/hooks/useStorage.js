import { useCallback, useEffect, useState } from "react";
import { getStorage, setStorage } from "../utils/browserStorage";
import { defaultSetting } from "../data/storage-key";

export const useStorageState = (storageKey) => {
  const [state, setState] = useState({
    key: storageKey,
    value: defaultSetting[storageKey],
    loaded: false,
  });
  useEffect(() => {
    let active = true;
    let changed = false;
    setState({
      key: storageKey,
      value: defaultSetting[storageKey],
      loaded: false,
    });
    const onChanged = (changes, area) => {
      if (area !== "local" || !changes[storageKey]) return;
      changed = true;
      setState({
        key: storageKey,
        value: changes[storageKey].newValue ?? defaultSetting[storageKey],
        loaded: true,
      });
    };
    chrome.storage.onChanged.addListener(onChanged);
    getStorage(storageKey)
      .then((value) => {
        if (active && !changed)
          setState({ key: storageKey, value, loaded: true });
      })
      .catch((error) => console.warn(error));
    return () => {
      active = false;
      chrome.storage.onChanged.removeListener(onChanged);
    };
  }, [storageKey]);
  const setValue = useCallback(
    (value) => {
      setState({ key: storageKey, value, loaded: true });
      setStorage({ [storageKey]: value }).catch((error) => console.warn(error));
    },
    [storageKey]
  );
  return [
    state.key === storageKey ? state.value : defaultSetting[storageKey],
    setValue,
    state.key === storageKey && state.loaded,
  ];
};
