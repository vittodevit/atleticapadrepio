'use client';
import React, {useActionState, useState, useEffect} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import ConditionalHider from "@/components/conditional-hider";
import DbLoading from "@/components/db-loading";
import ErrorAlert from "@/components/error-alert";
import changePasswordSelfAction from "@/actions/change-password-self";
import {toast} from "react-toastify";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Save} from "lucide-react";

interface ChangePasswordDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({isDialogOpen, setIsDialogOpen}) => {
  const [state, formAction, pending] = useActionState(changePasswordSelfAction, {message: ''});

  // stati dei fields
  const [oldPasswordField, setOldPasswordField] = useState("");
  const [newPasswordField, setNewPasswordField] = useState("");
  const [confirmPasswordField, setConfirmPasswordField] = useState("");

  useEffect(() => {
    if(state.message === 'success'){
      setIsDialogOpen(false);
      toast.success('Password aggiornata con successo');
    }
  }, [state]);

  return state.message !== 'success' ? (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Cambio password</DialogTitle>
          <DialogDescription>
            Da qui puoi cambiare la tua password
          </DialogDescription>
        </DialogHeader>
        <ConditionalHider hidden={!pending}>
          <div className="mt-3"><DbLoading/></div>
        </ConditionalHider>
        <ConditionalHider hidden={!state.message || pending}>
          <div className="mt-3">
            <ErrorAlert error={state.message}/>
          </div>
        </ConditionalHider>
        <form action={formAction}>
          <div className="grid gap-4 py-4 mb-3">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="oldPassword" className="text-right">
                Vecchia password *
              </Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                className="col-span-3"
                value={oldPasswordField}
                type="password"
                onChange={(e) => setOldPasswordField(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="text-right">
                Nuova password *
              </Label>
              <Input
                id="newPassword"
                name="newPassword"
                className="col-span-3"
                value={newPasswordField}
                type="password"
                onChange={(e) => setNewPasswordField(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPassword" className="text-right">
                Conferma password *
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                className="col-span-3"
                value={confirmPasswordField}
                type="password"
                onChange={(e) => setConfirmPasswordField(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              <Save />
              Salva
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default ChangePasswordDialog;