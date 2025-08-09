'use server';
/**
 * @fileOverview Checks the borrowing purpose for safety and rule compliance.
 *
 * - borrowingSanityCheck - A function that checks the borrowing purpose.
 * - BorrowingSanityCheckInput - The input type for the borrowingSanityCheck function.
 * - BorrowingSanityCheckOutput - The return type for the borrowingSanityCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BorrowingSanityCheckInputSchema = z.object({
  purpose: z.string().describe('The stated purpose for borrowing the component.'),
  componentName: z.string().describe('The name of the component being borrowed.'),
});
export type BorrowingSanityCheckInput = z.infer<typeof BorrowingSanityCheckInputSchema>;

const BorrowingSanityCheckOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the stated purpose is considered safe and compliant with rules.'),
  warningMessage: z.string().describe('A warning message if the purpose is unsafe or non-compliant, otherwise an empty string.'),
});
export type BorrowingSanityCheckOutput = z.infer<typeof BorrowingSanityCheckOutputSchema>;

export async function borrowingSanityCheck(input: BorrowingSanityCheckInput): Promise<BorrowingSanityCheckOutput> {
  return borrowingSanityCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'borrowingSanityCheckPrompt',
  input: {schema: BorrowingSanityCheckInputSchema},
  output: {schema: BorrowingSanityCheckOutputSchema},
  prompt: `You are an AI assistant that reviews the purpose for borrowing a component and determines if it is safe and compliant with the rules of the Kathmandu University Robotics Club (KURC).

  Component Name: {{{componentName}}}
  Purpose: {{{purpose}}}

  Rules:
  - Components should be used for educational and robotics-related projects only.
  - Components should not be used in a way that could cause harm to people or property.
  - Components should not be modified without permission.
  - Components should be returned in the same condition they were borrowed.

  Assess the provided purpose and determine if it is safe and follows the rules. If the purpose is unsafe or violates the rules, set isSafe to false and provide a warning message. If the purpose is safe and compliant, set isSafe to true and set warningMessage to an empty string.

  Respond in JSON format:
  {
    "isSafe": boolean,
    "warningMessage": string
  }`,
});

const borrowingSanityCheckFlow = ai.defineFlow(
  {
    name: 'borrowingSanityCheckFlow',
    inputSchema: BorrowingSanityCheckInputSchema,
    outputSchema: BorrowingSanityCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
