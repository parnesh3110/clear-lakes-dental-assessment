export default defineEventHandler(async (event) => {
  try {
    console.log("=== LIST API CALLED ===");

    const { serverSupabaseClient, serverSupabaseUser } = await import(
      "#supabase/server"
    );

    const supabase = await serverSupabaseClient(event);

    let user;
    try {
      user = await serverSupabaseUser(event);
    } catch (authError) {
      console.error("Auth error:", authError);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        user = session.user;
      } else {
        return {
          success: false,
          error: "Not authenticated. Please log in again.",
        };
      }
    }

    console.log("User authenticated:", user?.id);

    if (!user) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("Supabase response:", { count: data?.length, error });

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: `Database error: ${error.message}`,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error("Server error:", error);
    return {
      success: false,
      error: `Server error: ${error.message}`,
    };
  }
});
