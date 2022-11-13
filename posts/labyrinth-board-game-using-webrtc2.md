---
title: "Labyrinth board game using WebRTC"
slug: "8-labyrinth-board-game-using-webrtc"
createdAt: "2022-11-13"
coverImage: "/content-assets/7/cover.png"
preview: false
description: >
  Peer-to-peer Labyrinth board game hosted on the player's browser.
tags:
  - typescript
  - game
  - webrtc
---



<Image caption="Labyrinth board game. Image by Geeky Hobbies." alt="Labyrinth board game" src="/content-assets/7/board.jpg" wrapperClassName="my-4 mb-12" />


One Saturday evening, we were enjoying the weekend and playing Labyrinth the board game. It's a surprisingly fun game even for adults due to its mechanics. There's certainly luck involved but the game decently rewards for route calculation skills.

The most dreading part of the game is the initial shuffling of pieces. Often when my wife seemed happy with the piece positions, I noticed having a few extra strict rules for the initial board. To figure my brain's shuffling rules, I wrote them down:

1. Each player should be tightly cornered at the start.
2. There should be minimal amount of already connected paths.


That summoned a lot of questions.

> What's the maximum length of connected pieces you should aim for?
> What would be a good shuffling algorithm?
> Is it even possible to go as low as maximum 2 pieces connected?

That's what we're about to find out!

## Let's get coding

To answer these questions, we obviously need to build the whole game as a React app first.



Geeky hobbies has a good [overview](https://www.geekyhobbies.com/labyrinth-the-amazeing-labyrinth-board-game-review-and-rules/) of the game play and its rules.

Online version of the Labyrinth board game. The game server runs on the host's browser and networking happens peer-to-peer.