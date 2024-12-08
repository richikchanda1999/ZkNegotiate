import React from "react";
import Modal from "./content";
import { StepsProvider } from "./context";

export default function Page({
  isModalOpen,
  onClose,
}: {
  isModalOpen: boolean;
  onClose: () => void;
}) {
  return (
    <StepsProvider>
      <Modal isOpen={isModalOpen} onClose={onClose} />
    </StepsProvider>
  );
}
