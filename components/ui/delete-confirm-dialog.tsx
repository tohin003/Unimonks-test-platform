"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemName: string;
    itemType: string; // e.g. "batch", "test", "user"
    onDisable?: () => void;
    onPermanentDelete: () => void;
    disableLabel?: string;
    showDisableOption?: boolean;
    loading?: boolean;
}

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    itemName,
    itemType,
    onDisable,
    onPermanentDelete,
    disableLabel = "Disable",
    showDisableOption = true,
    loading = false,
}: DeleteConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl border-0 shadow-lg max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="bg-rose-100 p-2 rounded-xl">
                            <AlertTriangle className="h-5 w-5 text-rose-600" />
                        </div>
                        <AlertDialogTitle className="font-serif text-xl text-slate-900">
                            Remove {itemType}?
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-slate-500 leading-relaxed">
                        You are about to remove <span className="font-bold text-slate-700">&ldquo;{itemName}&rdquo;</span>.
                        Choose how you want to proceed:
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-3 my-2">
                    {showDisableOption && onDisable && (
                        <Button
                            variant="outline"
                            onClick={() => { onDisable(); onOpenChange(false); }}
                            disabled={loading}
                            className="w-full justify-start h-auto py-3 px-4 rounded-xl border-amber-200 bg-amber-50 hover:bg-amber-100 text-left"
                        >
                            <div>
                                <div className="font-bold text-amber-800 text-sm">{disableLabel}</div>
                                <div className="text-xs text-amber-600 mt-0.5">
                                    Mark as inactive. Data is preserved and can be restored.
                                </div>
                            </div>
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => { onPermanentDelete(); onOpenChange(false); }}
                        disabled={loading}
                        className="w-full justify-start h-auto py-3 px-4 rounded-xl border-rose-200 bg-rose-50 hover:bg-rose-100 text-left"
                    >
                        <div>
                            <div className="font-bold text-rose-800 text-sm">Permanent Delete</div>
                            <div className="text-xs text-rose-600 mt-0.5">
                                Permanently remove this {itemType}. This action cannot be undone.
                            </div>
                        </div>
                    </Button>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl border-slate-200">Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
