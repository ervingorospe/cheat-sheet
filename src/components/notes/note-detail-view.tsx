import Images from "@/components/common/images";
import { H3, Paragraph, SizableText } from "@/components/theme";
import { useNoteFolder } from "@/hooks/use-note-folder";
import { Note, toDocLinks, toImageLinks, toKeyPoints } from "@/lib/notes";
import { formatDate } from "@/utils/date";
import { ExternalLink, Folder as FolderIcon } from "@tamagui/lucide-icons-2";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { XStack, YStack } from "tamagui";

type NoteDetailViewProps = {
  note: Note;
};

export default function NoteDetailView({ note }: NoteDetailViewProps) {
  const keyPoints = toKeyPoints(note.key_points);
  const docLinks = toDocLinks(note.doc_links);
  const imageLinks = toImageLinks(note.image_links);
  const { data: folder } = useNoteFolder(note.folder_id);

  const folderRow = (
    <XStack
      alignItems="center"
      gap="$xs"
      marginTop="$xs"
      marginBottom="$lg"
      pressStyle={note.folder_id ? { opacity: 0.6 } : undefined}
    >
      <FolderIcon size={14} color="$secondary" />
      <SizableText
        fontSize="$2"
        color="$secondary"
        textDecorationLine={note.folder_id ? "underline" : "none"}
      >
        {note.folder_id ? (folder?.name ?? "Loading...") : "No Folder"}
      </SizableText>
    </XStack>
  );

  return (
    <YStack>
      <XStack justifyContent="space-between" alignItems="flex-start">
        <YStack flex={1}>
          <H3>{note.title || "Untitled note"}</H3>
          <Paragraph color="$muted" marginTop="$xs">
            {formatDate(note.created_at)}
          </Paragraph>

          {note.folder_id ? (
            <Link
              href={{
                pathname: "/folders/[id]",
                params: { id: note.folder_id },
              }}
              asChild
            >
              {folderRow}
            </Link>
          ) : (
            folderRow
          )}
        </YStack>
      </XStack>

      {imageLinks.length > 0 && (
        <Images
          images={imageLinks}
          thumbnailStyle={{ width: 100, height: 100, borderRadius: 8 }}
        />
      )}

      {note.content && (
        <YStack marginBottom="$lg">
          <Paragraph>{note.content}</Paragraph>
        </YStack>
      )}

      {keyPoints.length > 0 && (
        <YStack gap="$sm" marginBottom="$lg">
          <SizableText fontSize="$5" fontWeight="700" marginBottom="$xs">
            Key Points
          </SizableText>

          {keyPoints.map((point, index) => (
            <XStack key={index} gap="$sm" alignItems="flex-start">
              <SizableText color="$primary" fontWeight="700">
                •
              </SizableText>
              <Paragraph flex={1}>{point}</Paragraph>
            </XStack>
          ))}
        </YStack>
      )}

      {docLinks.length > 0 && (
        <YStack gap="$sm">
          <SizableText fontSize="$5" fontWeight="700" marginBottom="$xs">
            Links
          </SizableText>

          {docLinks.map((link, index) => (
            <XStack
              key={index}
              gap="$sm"
              alignItems="center"
              onPress={() => WebBrowser.openBrowserAsync(link.url)}
            >
              <ExternalLink size={16} color="$primary" />
              <Paragraph flex={1} color="$primary">
                {link.label || link.url}
              </Paragraph>
            </XStack>
          ))}
        </YStack>
      )}
    </YStack>
  );
}
