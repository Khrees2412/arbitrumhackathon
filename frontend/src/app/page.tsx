"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <Image
                src="https://cdn.brandfetch.io/idIM5fgYlx/w/1500/h/500/idzH7tI6oU.jpeg?k=bfHSJFAPEG"
                alt="Arbitrum Logo"
                width={1000}
                height={1000}
                className="w-20 h-20"
            />
            <h1 className="text-6xl font-bold">Arbitrum Hackathon</h1>
            <Link href="/voting">
                <Button className="mt-4 bg-white text-black hover:bg-gray-200">
                    Continue to Chow d'or
                </Button>
            </Link>
        </div>
    );
}
