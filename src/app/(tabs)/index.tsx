import LoadingOverlay from "@/components/common/loading-overlay";
import Screen from "@/components/layout/screen";
import { SizableText } from "@/components/theme";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsLoading(false);
    };

    loadHomeData();
  }, []);

  if (isLoading) {
    return (
      <Screen>
        <LoadingOverlay visible={isLoading} />
      </Screen>
    );
  }

  return (
    <Screen>
      <SizableText>testing</SizableText>
    </Screen>
  );
}
