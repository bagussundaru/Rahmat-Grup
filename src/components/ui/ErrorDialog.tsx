import React from 'react';
import Button from './Button';
import Icon from './AppIcon';

interface ErrorDialogProps {
  open: boolean;
  title: string;
  code?: string;
  message: string;
  suggestion?: string;
  onClose: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ open, title, code, message, suggestion, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={18} className="text-destructive" />
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={18} />
          </Button>
        </div>
        <div className="p-4 space-y-3">
          {code && (
            <div className="text-xs text-muted-foreground">Kode: {code}</div>
          )}
          <p className="text-sm text-foreground">{message}</p>
          {suggestion && (
            <div className="bg-muted rounded-md p-3 text-sm text-muted-foreground">{suggestion}</div>
          )}
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t border-border">
          <Button variant="outline" onClick={onClose} iconName="Check" iconPosition="left">Tutup</Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog;
