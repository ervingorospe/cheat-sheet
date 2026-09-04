import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { cloneElement, type ReactElement } from "react";
import { type TextProps } from "react-native";

type LinearGradientTextProps = {
  children: ReactElement<TextProps>;
  firstColor?: string;
  secondColor?: string;
};

export default function GradientLinear({
  children,
  firstColor = "#105F2D",
  secondColor = "#22C55E",
}: LinearGradientTextProps) {
  return (
    <MaskedView maskElement={children}>
      <LinearGradient
        colors={[firstColor, secondColor]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      >
        {cloneElement(children, {
          style: [
            children.props.style,
            {
              opacity: 0,
            },
          ],
        })}
      </LinearGradient>
    </MaskedView>
  );
}
