// Adds a word set shared from app.gibtalk.com: paste its link, or scan its
// QR code with the camera.
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { RootStackParamList } from "../../../App";
import PressableOpacity from "../../components/PressableOpacity";
import SafeAreaView from "../../components/SafeAreaView";
import { useBackup } from "../../service/backup";
import { useWords } from "../../service/words";
import {
  SharedSet,
  countWords,
  isShareLink,
  readShareLink,
  withPictures,
} from "../../service/shareLink";

type Props = StackScreenProps<RootStackParamList, "openSharedSet">;

export default function OpenSharedSetScreen(_props: Props) {
  const navigation = useNavigation<Props["navigation"]>();
  const { addSharedSet } = useBackup();
  const { words } = useWords();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [link, setLink] = useState("");
  const [set, setSet] = useState<SharedSet | null>(null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  // The camera reports the same code many times a second: read it once.
  const handled = useRef(false);

  const open = (text: string) => {
    try {
      setSet(readShareLink(text));
      setError("");
      return true;
    } catch (e) {
      setSet(null);
      setError(e instanceof Error ? e.message : String(e));
      return false;
    }
  };

  const startScan = async () => {
    const granted = permission?.granted || (await requestPermission()).granted;
    if (!granted) {
      Alert.alert(
        "Camera not allowed",
        "Allow GibTalk to use the camera in the device's Settings, or paste the link instead.",
      );
      return;
    }
    handled.current = false;
    setSet(null);
    setError("");
    setScanning(true);
  };

  const onScanned = ({ data }: { data: string }) => {
    if (handled.current) return;
    if (!isShareLink(data)) {
      handled.current = true;
      setScanning(false);
      setError("That QR code isn't a GibTalk share code.");
      return;
    }
    handled.current = true;
    setScanning(false);
    setLink(data);
    open(data);
  };

  const onAdd = async () => {
    if (!set) return;
    setAdding(true);
    try {
      await addSharedSet(set);
      navigation.popToTop();
    } catch (e) {
      Alert.alert(
        "Couldn't add the words",
        e instanceof Error && e.message.startsWith("This set")
          ? e.message
          : "Check the internet connection and try again.",
      );
    } finally {
      setAdding(false);
    }
  };

  if (scanning) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={onScanned}
        />
        <View style={styles.scanBar}>
          <Text style={styles.scanText}>Point the camera at the QR code</Text>
          <PressableOpacity
            style={styles.button}
            onPress={() => setScanning(false)}
          >
            <Text>Cancel</Text>
          </PressableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const total = set ? countWords(set.words) : 0;
  // Same rule as addSharedSet: onto an empty Home, or a set that's one folder.
  const asFolder =
    !!set &&
    words.length > 0 &&
    !(set.words.length === 1 && !!set.words[0].children);
  const shown = set ? countWords(withPictures(set.words)) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.intro}>
          Teachers and therapists can make word sets at app.gibtalk.com and
          share them with a link or QR code.
        </Text>

        <PressableOpacity
          style={styles.bigButton}
          onPress={startScan}
          testID="scan-share-code"
        >
          <FontAwesome name="qrcode" size={28} />
          <Text style={styles.bigButtonText}>Scan QR code</Text>
        </PressableOpacity>

        <Text style={styles.label}>Or paste the link</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={link}
            onChangeText={(text) => {
              setLink(text);
              setError("");
              // Open a whole pasted link straight away; a link that's still
              // being typed only shows a problem when Open is pressed.
              try {
                setSet(readShareLink(text));
              } catch {
                setSet(null);
              }
            }}
            placeholder="https://app.gibtalk.com/s#…"
            autoCapitalize="none"
            autoCorrect={false}
            testID="share-link-input"
          />
          <PressableOpacity
            style={styles.button}
            onPress={() => link.trim() && open(link)}
          >
            <Text>Open</Text>
          </PressableOpacity>
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        {set && (
          <View style={styles.preview} testID="shared-set">
            <View style={styles.previewHead}>
              <Text style={styles.setName}>{set.name}</Text>
              <PressableOpacity
                style={[styles.button, styles.addButton]}
                onPress={() => !adding && shown > 0 && onAdd()}
                testID="add-shared-set"
              >
                {adding ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text style={styles.addText}>Add to GibTalk</Text>
                )}
              </PressableOpacity>
            </View>
            <Text>
              {shown} word{shown === 1 ? "" : "s"}
              {shown < total
                ? ` (${total - shown} without a picture are left out)`
                : ""}
            </Text>
            <View style={styles.pictures}>
              {withPictures(set.words)
                .slice(0, 8)
                .map((w, i) => (
                  <View key={i} style={styles.tile}>
                    <Image source={{ uri: w.uri }} style={styles.picture} />
                    <Text numberOfLines={1} style={styles.tileLabel}>
                      {w.label}
                    </Text>
                  </View>
                ))}
            </View>
            <Text style={styles.note}>
              {asFolder
                ? `The words arrive as a new folder, "${set.name}", after the words you already have.`
                : "The words are added to Home."}{" "}
              You can change or remove them later.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white", alignSelf: "stretch" },
  container: { padding: 16 },
  intro: { fontSize: 16, marginBottom: 16 },
  bigButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 14,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "lightgreen",
  },
  bigButtonText: { fontSize: 18, fontWeight: "bold" },
  label: { marginTop: 24, marginBottom: 6, fontWeight: "bold" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 8,
    height: 44,
  },
  button: {
    borderWidth: 2,
    borderRadius: 5,
    height: 44,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  error: { color: "#b00020", marginTop: 12, fontSize: 15 },
  preview: { marginTop: 24, padding: 12, borderWidth: 2, borderRadius: 10 },
  previewHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 4,
  },
  setName: { fontSize: 20, fontWeight: "bold", flexShrink: 1 },
  pictures: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  tile: {
    width: 76,
    alignItems: "center",
    backgroundColor: "lightgreen",
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
  },
  picture: { width: 60, height: 60, backgroundColor: "white" },
  tileLabel: { fontSize: 12, fontWeight: "bold" },
  note: { marginTop: 12, color: "#555" },
  addButton: { backgroundColor: "lightgreen" },
  addText: { fontWeight: "bold" },
  camera: { flex: 1 },
  scanBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  scanText: { fontSize: 16 },
});
