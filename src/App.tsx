// Dragvertising Canva App - Main Entry Point
// This app runs inside Canva editor and lets users import show data

import React, { useState, useEffect } from "react";
import { addNativeElement } from "@canva/design";
import { upload } from "@canva/asset";
import { 
  Button, 
  Rows, 
  Columns,
  Text, 
  Title,
  Box,
  LoadingIndicator,
  Alert,
  TextInput,
  Scrollable,
} from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";

// Types
interface Show {
  id: string;
  title: string;
  show_date: string;
  venue_name: string;
  description: string;
  lineup: Performer[];
  cover_image_url?: string;
}

interface Performer {
  id: string;
  display_name: string;
  stage_name: string;
  profile_image_url?: string;
  bio?: string;
}

// Configuration
const DRAGVERTISING_API_URL = process.env.DRAGVERTISING_API_URL || "https://api.dragvertising.com";

export function App() {
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem("dragvertising_token");
    if (token) {
      setAuthenticated(true);
      loadShows();
    }
  }

  async function loadShows() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("dragvertising_token");
      const response = await fetch(`${DRAGVERTISING_API_URL}/api/shows`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load shows");
      }

      const data = await response.json();
      setShows(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error loading shows:", err);
    } finally {
      setLoading(false);
    }
  }

  async function insertShowIntoDesign(show: Show) {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Insert show title (large, bold, centered)
      await addNativeElement({
        type: "TEXT",
        children: [show.title.toUpperCase()],
        fontSize: 72,
        fontWeight: "bold",
        color: "#FF00FF", // Drag queen purple!
        textAlign: "center",
        top: 100,
        left: 0,
        width: 1080,
      });

      // 2. Insert date and venue (subtitle)
      const dateStr = new Date(show.show_date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      
      await addNativeElement({
        type: "TEXT",
        children: [`${dateStr} • ${show.venue_name}`],
        fontSize: 28,
        color: "#000000",
        textAlign: "center",
        top: 200,
        left: 0,
        width: 1080,
      });

      // 3. Insert cover image if available
      if (show.cover_image_url) {
        try {
          const { ref } = await upload({
            type: "IMAGE",
            url: show.cover_image_url,
            thumbnailUrl: show.cover_image_url,
            mimeType: "image/jpeg",
          });

          await addNativeElement({
            type: "IMAGE",
            ref: ref,
            top: 300,
            left: 290,
            width: 500,
            height: 500,
          });
        } catch (imgError) {
          console.warn("Failed to upload cover image:", imgError);
        }
      }

      // 4. Insert "FEATURING" text
      await addNativeElement({
        type: "TEXT",
        children: ["FEATURING"],
        fontSize: 32,
        fontWeight: "bold",
        color: "#FFD700", // Gold
        textAlign: "center",
        top: 850,
        left: 0,
        width: 1080,
      });

      // 5. Insert performer names
      let performerY = 920;
      for (const performer of show.lineup) {
        await addNativeElement({
          type: "TEXT",
          children: [performer.stage_name || performer.display_name],
          fontSize: 24,
          fontWeight: "medium",
          color: "#000000",
          textAlign: "center",
          top: performerY,
          left: 0,
          width: 1080,
        });
        performerY += 40;
      }

      // Success!
      setError(null);
      alert(`✨ ${show.title} inserted into your design!`);
      
    } catch (err: any) {
      setError(`Failed to insert show: ${err.message}`);
      console.error("Error inserting show:", err);
    } finally {
      setLoading(false);
    }
  }

  async function insertPerformerGrid(show: Show) {
    setLoading(true);
    setError(null);

    try {
      const columns = 3;
      const rows = Math.ceil(show.lineup.length / columns);
      const imageSize = 300;
      const spacing = 40;
      
      let index = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          if (index >= show.lineup.length) break;
          
          const performer = show.lineup[index];
          const x = 90 + col * (imageSize + spacing);
          const y = 100 + row * (imageSize + spacing + 60);
          
          // Upload and insert performer photo
          if (performer.profile_image_url) {
            try {
              const { ref } = await upload({
                type: "IMAGE",
                url: performer.profile_image_url,
                thumbnailUrl: performer.profile_image_url,
                mimeType: "image/jpeg",
              });

              await addNativeElement({
                type: "IMAGE",
                ref: ref,
                top: y,
                left: x,
                width: imageSize,
                height: imageSize,
              });
            } catch (imgError) {
              console.warn(`Failed to upload image for ${performer.display_name}:`, imgError);
            }
          }
          
          // Insert performer name below photo
          await addNativeElement({
            type: "TEXT",
            children: [performer.stage_name || performer.display_name],
            fontSize: 20,
            fontWeight: "bold",
            color: "#000000",
            textAlign: "center",
            top: y + imageSize + 10,
            left: x,
            width: imageSize,
          });
          
          index++;
        }
      }

      alert(`✨ ${show.lineup.length} performers inserted!`);
      
    } catch (err: any) {
      setError(`Failed to insert performers: ${err.message}`);
      console.error("Error inserting performers:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin() {
    // Open OAuth login in popup
    const loginUrl = `${DRAGVERTISING_API_URL}/auth/canva/authorize`;
    window.open(loginUrl, "_blank", "width=600,height=700");
    
    // Listen for auth success message
    window.addEventListener("message", (event) => {
      if (event.data.type === "dragvertising_auth_success") {
        localStorage.setItem("dragvertising_token", event.data.token);
        setAuthenticated(true);
        loadShows();
      }
    });
  }

  // Filter shows based on search
  const filteredShows = shows.filter((show) =>
    show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    show.venue_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Not authenticated - show login
  if (!authenticated) {
    return (
      <Scrollable>
        <Rows spacing="3u" align="center">
          <Box padding="3u">
            <Rows spacing="2u" align="center">
              <Title size="large">Dragvertising</Title>
              <Text align="center">
                Import your drag show data directly into Canva designs
              </Text>
              <Button 
                variant="primary" 
                onClick={handleLogin}
                stretch
              >
                Connect to Dragvertising
              </Button>
              <Text size="small" tone="tertiary" align="center">
                Don't have an account?{" "}
                <a 
                  href="https://dragvertising.com/signup" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#FF00FF" }}
                >
                  Sign up free
                </a>
              </Text>
            </Rows>
          </Box>
        </Rows>
      </Scrollable>
    );
  }

  // Loading shows
  if (loading && shows.length === 0) {
    return (
      <Rows spacing="2u" align="center">
        <LoadingIndicator size="large" />
        <Text>Loading your shows...</Text>
      </Rows>
    );
  }

  // Show selected - detail view
  if (selectedShow) {
    return (
      <Scrollable>
        <Rows spacing="2u">
          <Button 
            variant="tertiary" 
            onClick={() => setSelectedShow(null)}
            icon="arrowLeft"
          >
            Back to shows
          </Button>
          
          <Box padding="2u" background="neutralLow">
            <Rows spacing="1u">
              <Title size="medium">{selectedShow.title}</Title>
              <Text size="small">
                {new Date(selectedShow.show_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
              <Text size="small" tone="tertiary">
                📍 {selectedShow.venue_name}
              </Text>
            </Rows>
          </Box>

          {selectedShow.description && (
            <Box padding="2u">
              <Rows spacing="0.5u">
                <Text weight="bold">Description</Text>
                <Text size="small">{selectedShow.description}</Text>
              </Rows>
            </Box>
          )}

          <Box padding="2u">
            <Rows spacing="0.5u">
              <Text weight="bold">
                Lineup ({selectedShow.lineup.length} performers)
              </Text>
              {selectedShow.lineup.map((performer) => (
                <Text key={performer.id} size="small">
                  • {performer.stage_name || performer.display_name}
                </Text>
              ))}
            </Rows>
          </Box>

          {error && (
            <Alert tone="critical">{error}</Alert>
          )}

          <Rows spacing="1u">
            <Button
              variant="primary"
              onClick={() => insertShowIntoDesign(selectedShow)}
              disabled={loading}
              stretch
            >
              {loading ? "Inserting..." : "Insert Show Details"}
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => insertPerformerGrid(selectedShow)}
              disabled={loading}
              stretch
            >
              {loading ? "Inserting..." : "Insert Performer Grid"}
            </Button>
          </Rows>
        </Rows>
      </Scrollable>
    );
  }

  // Main view - show list
  return (
    <Scrollable>
      <Rows spacing="2u">
        <Box padding="2u">
          <Rows spacing="1u">
            <Title>Your Shows</Title>
            <TextInput
              placeholder="Search shows..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </Rows>
        </Box>

        {error && (
          <Alert tone="critical" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        {filteredShows.length === 0 ? (
          <Box padding="3u">
            <Rows spacing="1u" align="center">
              <Text align="center">
                {searchQuery ? "No shows match your search" : "No shows found"}
              </Text>
              <Button
                variant="secondary"
                onClick={() => window.open("https://dragvertising.com/shows/create", "_blank")}
              >
                Create a show
              </Button>
            </Rows>
          </Box>
        ) : (
          <Rows spacing="1u">
            {filteredShows.map((show) => (
              <Button
                key={show.id}
                variant="secondary"
                onClick={() => setSelectedShow(show)}
                align="start"
              >
                <Rows spacing="0.5u">
                  <Text weight="bold">{show.title}</Text>
                  <Text size="small" tone="tertiary">
                    {new Date(show.show_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    • {show.venue_name}
                  </Text>
                  <Text size="small">
                    {show.lineup.length} performer{show.lineup.length !== 1 ? "s" : ""}
                  </Text>
                </Rows>
              </Button>
            ))}
          </Rows>
        )}
      </Rows>
    </Scrollable>
  );
}

