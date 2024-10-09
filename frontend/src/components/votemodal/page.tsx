// "use client";

// import { useState } from "react";
// import {
//     Dialog,
//     DialogContent,
//     DialogTitle,
//     DialogTrigger,
//     DialogHeader,
//     DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { ThumbsUp } from "lucide-react";

// export default function VoteModal({
//     numberOfTokens,
//     setNumberOfTokens,
// }: {
//     numberOfTokens: string;
//     setNumberOfTokens: (value: string) => void;
// }) {
//     const handleNumberOfTokensChange = (
//         e: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         setNumberOfTokens(e.target.value);
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (numberOfTokens) {
//             console.log("Submitted number of tokens: ", numberOfTokens);
//         }
//     };
//     return (
//         <Dialog>
//             <DialogTrigger asChild>
//                 <Button variant="outline" className="text-white">
//                     <ThumbsUp className="w-4 h-4 mr-2" />
//                     Vote
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="flex flex-col items-center justify-center mt-10">
//                 <DialogHeader>
//                     <DialogTitle className="font-bold text-3xl">
//                         How much tokens do you want to vote with?
//                         <span className="text-primary-foreground">
//                             100 tokens = 1 vote
//                         </span>
//                     </DialogTitle>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit}>
//                     <div className="space-y-4">
//                         <Label htmlFor="token">Token</Label>
//                         <Input
//                             id="token"
//                             name="token"
//                             type="number"
//                             value={numberOfTokens}
//                             onChange={handleNumberOfTokensChange}
//                             placeholder="Enter number of tokens"
//                             required
//                         />
//                     </div>
//                 </form>

//                 <DialogFooter className="w-full">
//                     <Button className="w-full" type="submit">
//                         Vote
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VoteButtonProps {
    restaurantId: string;
    onVote: (id: string) => Promise<void>;
    disabled?: boolean;
}

export function VoteButton({
    restaurantId,
    onVote,
    disabled,
}: VoteButtonProps) {
    const [isVoting, setIsVoting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        setIsVoting(true);
        setError(null);
        try {
            await onVote(restaurantId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to vote");
        } finally {
            setIsVoting(false);
        }
    };
    return (
        <div className="flex flex-col gap-2">
            <Button
                onClick={handleClick}
                disabled={disabled || isVoting}
                className="bg-white text-black hover:bg-gray-200"
            >
                {isVoting ? "Voting..." : "Vote Now"}
            </Button>
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
