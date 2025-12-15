import Image from 'next/image';
import { getServerSession } from 'next-auth/next';
import { authOption } from '@/auth';
import InfiniteDiplomasList from './infinite-diplomas-list';


export default async function DiplomasList() {
// throw new Error("failed to fetch products"); 
    const session = await getServerSession(authOption);
    
    // Get the accessToken from the session
    const accessToken = session?.accessToken;
    
    if (!accessToken) {
      return <div>Not authenticated</div>;
    }
    
    return <InfiniteDiplomasList accessToken={accessToken} />;
}
