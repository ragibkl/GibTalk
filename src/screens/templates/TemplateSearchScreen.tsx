import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { RootStackParamList } from "../../../App";
import {
  TemplateItem,
  fetchTemplate,
  getTemplates,
} from "../../service/templateSearch";
import { useBackup } from "../../service/backup";

import PressableOpacity from "../../components/PressableOpacity";
import ModalOpacity from "../../components/ModalOpacity";

type TemplatesScreenProps = StackScreenProps<
  RootStackParamList,
  "searchTemplate"
>;

export default function TemplateSearchScreen(props: TemplatesScreenProps) {
  const navigation = useNavigation<TemplatesScreenProps["navigation"]>();
  const { restoreBackupContents } = useBackup();

  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(
    null,
  );

  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const doFetchTemplates = async () => {
    setIsFetching(true);
    const results = await getTemplates();
    setTemplates(results);
    setIsFetching(false);
  };

  useEffect(() => {
    doFetchTemplates();
  }, []);

  const onPressRefresh = () => {
    doFetchTemplates();
  };

  const modalSetVisible = (visible: boolean) => {
    if (!visible && !isLoading) {
      setSelectedTemplate(null);
    }
  };

  const onModalPressCancel = () => {
    if (!isLoading) {
      setSelectedTemplate(null);
    }
  };

  const onModalPressOk = async () => {
    if (!selectedTemplate) {
      return;
    }

    setIsLoading(true);
    const content = await fetchTemplate(selectedTemplate);
    await restoreBackupContents(content);
    setSelectedTemplate(null);
    setIsLoading(false);
    navigation.pop();
  };

  const renderTemplateItem = (item: TemplateItem, i: number) => {
    const onPressTemplate = () => {
      setSelectedTemplate(item);
    };

    return (
      <PressableOpacity
        key={i}
        style={styles.template}
        onPress={onPressTemplate}
      >
        <Text style={styles.templateName}>{item.name}</Text>
        <Text style={styles.templateDescription}>{item.description}</Text>
        <Text style={styles.templateAuthor}>- {item.author} -</Text>
      </PressableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Available Templates:</Text>
        <Pressable
          style={styles.refreshButton}
          onPress={onPressRefresh}
          disabled={isFetching}
        >
          {isFetching ? (
            <ActivityIndicator size="small" />
          ) : (
            <FontAwesome name="refresh" size={20} />
          )}
        </Pressable>
      </View>

      <ScrollView style={styles.templateSection}>
        {isFetching ? (
          <ActivityIndicator size="large" />
        ) : templates.length ? (
          templates.map(renderTemplateItem)
        ) : (
          <Text>No templates found!</Text>
        )}
      </ScrollView>

      <ModalOpacity
        style={styles.modalContainer}
        visible={!!selectedTemplate}
        setVisible={modalSetVisible}
      >
        <Text style={styles.modalTextTitle}>{selectedTemplate?.name}</Text>
        <Text style={styles.modalText}>Load template?</Text>

        <View style={styles.modalButtonRow}>
          <PressableOpacity
            style={styles.modalButton}
            onPress={onModalPressCancel}
          >
            <Text>Cancel</Text>
          </PressableOpacity>

          <PressableOpacity
            style={[styles.modalButton, styles.okButton]}
            onPress={onModalPressOk}
          >
            {isLoading ? <ActivityIndicator size="small" /> : <Text>Ok</Text>}
          </PressableOpacity>
        </View>
      </ModalOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "stretch",
    padding: 10,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  refreshButton: {
    height: 40,
    width: 40,
    padding: 5,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  templateSection: {
    marginTop: 10,
  },
  template: {
    padding: 10,
    marginTop: 5,
    borderWidth: 2,
    borderRadius: 2,
  },
  templateName: {
    fontWeight: "bold",
  },
  templateDescription: {
    marginTop: 5,
    fontStyle: "italic",
  },
  templateAuthor: {
    fontStyle: "italic",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 10,
  },
  modalTextTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  modalButton: {
    marginLeft: 5,
    alignItems: "center",
    alignSelf: "flex-end",
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
    height: 40,
    marginTop: 10,
    padding: 5,
    width: 60,
  },
  okButton: {
    backgroundColor: "lightgreen",
  },
});
