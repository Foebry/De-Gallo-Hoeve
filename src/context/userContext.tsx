import { FEEDBACK_API } from '@/types/apiTypes';
import { useRouter } from 'next/router';
import { createContext, useState } from 'react';
import { toast } from 'react-toastify';
import useMutation from 'src/hooks/useMutation';
import { FeedbackBody } from 'src/pages/api/feedback/schemas';

type UserContext = {};

const defaultValues: UserContext = {};

export const UserContext = createContext<UserContext>(defaultValues);

const UserProvider: React.FC<{ children: any }> = ({ children }) => {
  return <UserContext.Provider value={{}}>{children}</UserContext.Provider>;
};

export default UserProvider;
