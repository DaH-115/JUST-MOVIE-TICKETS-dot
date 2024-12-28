"use client";

import { db, isAuth } from "firebase-config";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useError } from "store/error-context";
import { firebaseErrorHandler } from "app/utils/firebase-error";
import { useState } from "react";
import SocialLoginButton from "app/login/social-login-button";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import onGenerateDisplayName from "app/sign-up/utils/onGenerateDisplayName";
import { useAppDispatch } from "store/hooks";
import { onUpdateUserDisplayName } from "store/userSlice";

export type SocialProvider = "google" | "github";

export default function SocialLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isShowError } = useError();
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null,
  );

  const socialLoginHandler = async (provider: SocialProvider) => {
    setLoadingProvider(provider);
    try {
      // 1. 소셜 로그인
      const authProvider =
        provider === "google"
          ? new GoogleAuthProvider()
          : new GithubAuthProvider();
      const { user } = await signInWithPopup(isAuth, authProvider);

      // 2. 토큰 생성
      const token = await user.getIdToken();
      document.cookie = `firebase-session-token=${token}; path=/;max-age=86400`;

      // 3. Firestore 사용자 정보 확인
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      let userDisplayName = user.displayName;

      if (!userDoc.exists()) {
        // 3-1. 첫 로그인일 경우 Firestore에 사용자 정보 생성
        const generateDisplayName = await onGenerateDisplayName();
        userDisplayName = user.displayName || generateDisplayName;

        await setDoc(userRef, {
          name: user.displayName,
          displayName: user.displayName || generateDisplayName,
          email: user.email,
          profileImage: user.photoURL,
          provider,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          biography: "Make a ticket for your own movie review.",
          roll: "user",
        });
      } else {
        // 3-2. Firestore에 사용자 정보 업데이트
        userDisplayName = userDoc.data().displayName;
        await updateDoc(userRef, {
          updatedAt: serverTimestamp(),
        });
      }

      // 4. Redux 사용자 정보 업데이트
      if (userDisplayName) {
        dispatch(onUpdateUserDisplayName({ displayName: userDisplayName }));
      }

      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") return;
      const { title, message } = firebaseErrorHandler(error);
      isShowError(title, message);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <>
      <div className="mx-auto my-4 flex w-2/3 items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="mx-4 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex space-x-2">
          <SocialLoginButton
            provider="google"
            icon={<FcGoogle size={24} />}
            label="Google"
            onSocialLogin={socialLoginHandler}
            isLoading={loadingProvider === "google"}
          />
          <SocialLoginButton
            provider="github"
            icon={<FaGithub size={24} />}
            label="GitHub"
            onSocialLogin={socialLoginHandler}
            isLoading={loadingProvider === "github"}
          />
        </div>
      </div>
    </>
  );
}
