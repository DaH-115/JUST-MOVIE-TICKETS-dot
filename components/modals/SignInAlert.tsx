import React from 'react';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Alert from 'components/modals/Alert';
import { useAppDispatch } from 'store/hooks';
import { modalIsClose } from 'store/modalSlice';

const SignInAlert = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onMoveSignInHandler = useCallback(() => {
    router.push('/sign-in');
    dispatch(modalIsClose());
  }, []);

  return (
    <Alert
      alertDesc={'로그인이 필요한 페이지 입니다.'}
      onConfirmHandler={onMoveSignInHandler}
    />
  );
};

export default React.memo(SignInAlert);
