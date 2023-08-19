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

type TemplatesScreenProps = StackScreenProps<
  RootStackParamList,
  "searchTemplate"
>;

export default function TemplateSearchScreen(props: TemplatesScreenProps) {
  const navigation = useNavigation<TemplatesScreenProps["navigation"]>();
  const { restoreBackupContents } = useBackup();

  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);

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

  const restoreTemplate = async (item: TemplateItem) => {
    const content = await fetchTemplate(item);
    await restoreBackupContents(content);
    navigation.pop();
  };

  const renderTemplateItem = (item: TemplateItem, i: number) => {
    const onPressTemplate = () => {
      restoreTemplate(item);
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
        {templates.length ? (
          templates.map(renderTemplateItem)
        ) : (
          <Text>No templates found!</Text>
        )}
      </ScrollView>
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
});
