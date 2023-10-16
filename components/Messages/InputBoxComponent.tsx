import React, { useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import SVGComponent from "../SVGComponent";
import styles from "./style";
import ReusableModal from './../VIPModal/VIPModal';
import { useTranslation } from "../../TranslationContext";

interface InputBoxProps {
  text: string;
  setText: (text: string) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  handleSend: () => void;
  pickImage: () => void;
  isVip: boolean;
}

const InputBoxComponent: React.FC<InputBoxProps> = ({
  text,
  isVip,
  setText,
  showEmojiPicker,
  setShowEmojiPicker,
  handleSend,
  pickImage,
}) => {
  const [showVipModal, setShowVipModal] = useState(false);
  const i18n = useTranslation();

  return (
    <View style={{ flexDirection: "row" }}>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={i18n.t("WriteMessage")}
        />
        <Pressable
          style={styles.emojiInsideInput}
          onPress={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <SVGComponent
            iconName={showEmojiPicker ? "closeicon" : "emojiicon"}
            customWidth="25"
            customHeight="25"
          />
        </Pressable>
        {isVip ? ( // Render the "addphoto" button if user is VIP
          <Pressable
            onPress={() => {
              if (isVip) {
                pickImage();
              }
            }}
            style={{ paddingRight: 4 }}
          >
            <SVGComponent
              iconName="addphoto"
              customWidth="35"
              customHeight="35"
            />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setShowVipModal(true);
            }}
            style={{ paddingRight: 4 }}
          >
            <SVGComponent
              iconName="addphoto"
              customWidth="35"
              customHeight="35"
            />
          </Pressable>
        )}
      </View>
      <Pressable onPress={() => handleSend()} style={styles.send}>
        <SVGComponent iconName="mesaj" customWidth="35" customHeight="35" />
      </Pressable>

      {/* VIP Modal */}
      <ReusableModal
        isVisible={showVipModal}
        onClose={() => setShowVipModal(false)}
        onConfirm={() => setShowVipModal(false)}
        iconName="vip1"
        message={i18n.t("getVipOpenFeatures")}
        buttonText={i18n.t("closeText")}
      />
    </View>
  );
};

export default InputBoxComponent;
