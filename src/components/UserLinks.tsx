"use client"
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const UserLinks = () => {
    const {status} = useSession()
  return (
    <div>
      {(status === "authenticated") ? (
        <div>
        <Link href={"/orders"} className="mr-4">Order</Link>
        <span onClick={()=>signOut()} className="cursor-pointer">LogOut</span>
        </div>

      ) : (
        <Link href={"/login"}>LOGin</Link>
      )}
    </div>
  );
};

export default UserLinks;
