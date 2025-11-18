export default defineEventHandler(async (event) => {
  try {
    console.log("=== CREATE API CALLED ===");

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

    const body = await readBody(event);
    console.log("Body received:", body);

    if (!body.name || !body.email || !body.message) {
      return {
        success: false,
        error: "Missing required fields: name, email, and message are required",
      };
    }

    if (body.name.length < 2 || body.name.length > 100) {
      return {
        success: false,
        error: "Name must be between 2 and 100 characters",
      };
    }

    if (!body.email.includes("@")) {
      return {
        success: false,
        error: "Invalid email address",
      };
    }

    if (body.message.length < 10 || body.message.length > 1000) {
      return {
        success: false,
        error: "Message must be between 10 and 1000 characters",
      };
    }

    // Adding type assertion here for supabase types
    const { data, error } = await supabase
      .from("entries")
      .insert({
        user_id: user.id,
        name: body.name,
        email: body.email,
        message: body.message,
      } as any)
      .select()
      .single();

    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: `Database error: ${error.message}`,
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    console.error("Server error:", error);
    return {
      success: false,
      error: `Server error: ${error.message}`,
    };
  }
});
