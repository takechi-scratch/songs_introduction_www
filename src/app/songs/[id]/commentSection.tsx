"use client";

import { NewCommentCard, CommentCard } from "@/components/commentCard";
import { Comment } from "@/lib/interaction/types";
import { Paper, Box, Divider, Text } from "@mantine/core";
import { useState } from "react";

export default function CommentSection({
    songID,
    initialComments,
}: {
    songID: string;
    initialComments: Comment[];
}) {
    const [comments, setComments] = useState(initialComments);

    return (
        <Paper p="md" radius="md" shadow="xs">
            <NewCommentCard
                songID={songID}
                onCommentPosted={(comment) => {
                    setComments([comment, ...comments]);
                }}
            />

            {comments.length > 0 ? (
                comments.map((comment) => (
                    <Box key={comment.id}>
                        <Divider my="sm" />
                        <CommentCard comment={comment} />
                    </Box>
                ))
            ) : (
                <>
                    <Text mb="lg">
                        この曲にはまだコメントがありません。最初のコメントを投稿しましょう！
                    </Text>
                </>
            )}
        </Paper>
    );
}
