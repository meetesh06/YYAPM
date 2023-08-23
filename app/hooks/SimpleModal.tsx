import { useState } from 'react';


export const useGenericStatefulData = () => {
  
  const [modalVisible, setModalVisible] = useState(false);

  // show modal
  const showModal = (data: any) => {
    setModalVisible(true);
  }

  // close modal
  const closeModal = (data: any) => {
    setModalVisible(false);
  }

  return {showModal, closeModal}
}