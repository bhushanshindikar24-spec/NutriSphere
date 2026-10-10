import {  useContext  } from "react";
import { AuthContext } from '../../context/AuthContext';

export default function RoleGuard({ roles = [], children, fallback = null }) {
  const { user } = useContext(AuthContext);
  if (!user || (roles.length > 0 && !roles.includes(user.role))) {
    return fallback;
  }
  return children;
}
