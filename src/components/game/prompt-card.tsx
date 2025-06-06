"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PromptCardProps {
	prompt: string;
}

export default function PromptCard({ prompt }: PromptCardProps) {
	return (
		<Card className="mb-8 border-0 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-xl">
			<CardHeader>
				<CardTitle className="text-center text-2xl text-gray-800">
					Current Prompt
				</CardTitle>
			</CardHeader>
			<CardContent className="text-center">
				<p className="font-medium text-gray-700 text-xl leading-relaxed">
					{prompt}
				</p>
				<Badge variant="outline" className="mt-4">
					Replace "whatchamacallit" with your answer
				</Badge>
			</CardContent>
		</Card>
	);
}
