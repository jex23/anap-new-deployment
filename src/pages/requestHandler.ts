import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const submitFormRequest = async (
  formData: any,
  resetForm: () => void,
  setError: (error: string) => void,
  setOpenSnackbar: (open: boolean) => void
) => {
  try {
    await addDoc(collection(db, 'form_requests'), formData);
    console.log('Form submitted successfully!');
    resetForm(); // Reset the form fields after successful submission
  } catch (error) {
    setError('Error submitting the form: ' + error);
    setOpenSnackbar(true);
  }
};
