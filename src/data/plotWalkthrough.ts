// Implementation excerpts from the local PlotService startup files.
export const plotWalkthrough = [
  {
    "id": "runtime",
    "category": "Runtime boundary",
    "title": "One entry point, two implementations",
    "teaser": "Resolve the correct side when the module is required.",
    "description": "The wrapper checks RunService and returns the server or client module. Game code can use the same framework path while each runtime receives its own implementation.",
    "decision": "This keeps runtime selection in one place. The wrapper returns any; when I need autocomplete for a specific side, I require Server or Client directly.",
    "file": "PlotService.lua",
    "code": "if RunService:IsServer() then\n    return require(script:WaitForChild(\"Server\")) :: any\nelse\n    return require(script:WaitForChild(\"Client\")) :: any\nend"
  },
  {
    "id": "assignment",
    "category": "Server ownership",
    "title": "Assign once, release the guard",
    "teaser": "Coordinate assignment with a per-player guard and a promise.",
    "description": "The server ignores players already being assigned or already owning a plot. It finds an available plot, calls claim, fires plotClaimed on success, and clears its assignment guard in finally.",
    "decision": "The temporary guard prevents duplicate assignment attempts for the same player. finally clears it after either success or failure; the claim itself checks whether the plot is already owned.",
    "file": "PlotService/Server.lua",
    "code": "local function tryAssign(profile: PlayerProfile)\n    local player = profile.util.plr\n    if not player then\n        return\n    end\n    if assigning[player.UserId] or Server.getPlotOf(player) then\n        return\n    end\n\n    local freePlot = Server.getFreePlot()\n    if not freePlot then\n        warn(`[PlotService] no free plot for {player.Name}`)\n        return\n    end\n\n    assigning[player.UserId] = true\n    freePlot\n        :claim(profile)\n        :andThen(function()\n            Server.plotClaimed:Fire(freePlot, profile)\n        end)\n        :catch(function(err)\n            warn(`[PlotService] failed to claim plot '{freePlot:getId()}' for {player.Name} — {tostring(err)}`)\n        end)\n        :finally(function()\n            assigning[player.UserId] = nil\n        end)\nend"
  },
  {
    "id": "replication",
    "category": "Client resolution",
    "title": "Let replicated state find the plot",
    "teaser": "Read the current assignment, then listen for changes.",
    "description": "The server writes the player’s plot ID to an attribute. During AutoInit, the client checks the existing value and listens for changes. resolvePlot finds the model, starts its local components, and notifies waiting consumers.",
    "decision": "Checking both the current value and later changes handles an assignment that arrives before or after client initialization. Ownership stays on the server; the client resolves the first local plot for presentation.",
    "file": "PlotService/Client.lua",
    "code": "local function resolvePlot(id: string)\n    if localPlot then\n        return\n    end\n\n    local model = plotsFolder:FindFirstChild(id) or plotsFolder:WaitForChild(id, 10)\n    if not model then\n        warn(`[PlotService] plot '{id}' never appeared under Workspace.{Config.PlotsFolderName}`)\n        return\n    end\n\n    local plot = Plot.new(model :: Model)\n    plot:_startComponents()\n    localPlot = plot :: Plot.PlotClient\n    \n    localPlayer:SetAttribute(Config.PlotLoadedAttribute, true)\n    resolvedSignal:Fire(localPlot)\nend\n\n-- Assignment handling inside Client.AutoInit:\nlocal existing = localPlayer:GetAttribute(Config.PlayerPlotAttribute) :: string?\n    if existing then\n        resolvePlot(existing)\n    end\n\n    localPlayer:GetAttributeChangedSignal(Config.PlayerPlotAttribute):Connect(function()\n        local id = localPlayer:GetAttribute(Config.PlayerPlotAttribute) :: string?\n        if id then\n            resolvePlot(id)\n        end\n    end)"
  },
  {
    "id": "cleanup",
    "category": "Lifecycle cleanup",
    "title": "Give ownership a clear ending",
    "teaser": "Stop features, disconnect listeners, and clear ownership.",
    "description": "Unclaim is guarded to run on the server. It asks plot components to clean up, resets the claim sign, closes tracked connections, clears the plot and player attributes, and releases the owner reference. The claim error handler also calls unclaim when its ownership check permits rollback.",
    "decision": "Keeping teardown in one method gives normal player departures and claim failures a shared cleanup path. Components own their feature-specific cleanup instead of pushing it into the registry.",
    "file": "PlotService/Plot.lua",
    "code": "function Plot.unclaim(self: Plot, reason: string?)\n    if not assertServer() then\n        return\n    end\n    if not self:isOwned() then\n        return\n    end\n\n    local profile = self._owner\n    self:_stopComponents()\n    self:_applySign(nil)\n    self._connections:CloseAll()\n\n    self.instance:SetAttribute(Config.OwnerAttribute, nil)\n    if profile and profile.util.plr then\n        profile.util.plr:SetAttribute(Config.PlayerPlotAttribute, nil)\n        if reason == \"Kicked\" then\n            profile.util.plr:Kick(reason)\n        end\n    end\n\n    self._owner = nil\nend"
  }
]
