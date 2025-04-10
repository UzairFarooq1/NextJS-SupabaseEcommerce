import { getSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/profile-form";
import { Separator } from "@/components/ui/separator";
import OrderHistory from "@/components/profile/order-history";

export default async function ProfilePage() {
  const supabase = await getSupabaseServer();

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin?redirect=/profile");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <p className="text-muted-foreground">
                Update your personal details and address
              </p>
            </div>

            <Separator />

            <ProfileForm profile={profile} />
          </div>
        </div>

        <div className="space-y-6">
          <OrderHistory />
        </div>
      </div>
    </div>
  );
}
