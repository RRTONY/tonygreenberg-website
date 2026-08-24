# Popup Redesign Notes

## What the user sees (screenshot)
- Plain white card (#FAFAF7) with rounded corners
- "STILL HERE? GOOD." in gold DM Mono
- "Most people scroll past. You read." in Playfair Display
- Basic email input + gold gradient SUBSCRIBE button
- "Unsubscribe anytime. I'll survive."
- Black overlay behind it
- This is the QuirkyEmailPopup in Blog.tsx (lines 306-430)
- Triggers after 60 seconds on blog page

## Two other exit-intent systems
1. ExitIntentPopup in ConversionMechanics.tsx (lines 27-523) - "The Jewel Box" 
   - Already has a multi-phase dark jewel design
   - Renders in App.tsx for non-standalone routes
   - Triggers on mouse leave (desktop only, 20s delay)
   
2. ExitIntentTony in ExitIntentTony.tsx
   - Small bottom-right toast that triggers FauxTony
   - Renders in Layout.tsx
   - Triggers on mouse leave (5s minimum)

## Plan
- The Blog.tsx QuirkyEmailPopup is the ugly one the user sees
- Redesign it as a magnificent glass-morphism jewel invitation
- Keep the same trigger (60s timer) and email capture functionality
- Make it warm, supportive, awe-inspiring — not a plain white card
- Glass layers, sacred geometry accents, warm jewel tones
- No black background, no plain white — rich warm glass
