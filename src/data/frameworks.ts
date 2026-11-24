import type { Framework } from '../types/portfolio'

export const frameworks: Framework[] = [
  {
    id: 'profile',
    name: 'ProfileService',
    category: 'PLAYER DATA',
    summary: 'A shared player-data surface with schema defaults, path-based access, collection helpers, and change listeners.',
    serverSummary: 'Server code reads and updates player data, grants collection items, and reacts to authoritative changes.',
    clientSummary: 'Client code reads replicated values and subscribes to collection changes through the same service interface.',
    capabilities: ['Schema-driven data', 'Inventory collections', 'Change listeners'],
    language: 'Luau',
    serverCode: `local profile = PlayerService.get(player)
if not profile then return end

profile:addChild({"Inventory", "Swords"}, "sword1", {
    damage = 10,
})
profile:onChanged({"Cash"}, function(new, old)
    -- React to server-side changes.
end)`,
    clientCode: `local cash = PlayerService:getCash()
local swords = PlayerService:getChildren({"Inventory", "Swords"})

PlayerService:onChildAdded({"Inventory", "Swords"}, function(id, sword)
    print("New sword:", id, sword.damage)
end)`,
  },
  {
    id: 'analytics',
    name: 'AnalyticsService',
    category: 'TELEMETRY',
    summary: 'One API for economy, progression, funnel, and design events, with runtime-specific client and server implementations.',
    serverSummary: 'Server events record authoritative economy changes and progression milestones.',
    clientSummary: 'Client events can capture player-facing design interactions through the same analytics entry point.',
    capabilities: ['Economy events', 'Progression', 'Funnels & design'],
    language: 'Luau',
    serverCode: `function AnalyticsHub.LogEarn(player, currency, source, amount, balance, transType)
    AnalyticsHub.LogEconomy({
        Player = player,
        CurrencyName = currency,
        ItemSku = source,
        Amount = amount,
        Balance = balance,
        FlowType = "Source",
        TransactionType = transType or "Gameplay",
    })
end`,
    clientCode: `AnalyticsHub.LogDesign(
    "InventoryOpened",
    nil,
    { EntryPoint = "MainMenu" }
)`,
  },
  {
    id: 'plot',
    name: 'PlotService',
    category: 'WORLD SYSTEMS',
    summary: 'A client-server plot system with ownership lifecycle, local plot access, and reusable component hooks.',
    serverSummary: 'The server selects a free plot and assigns ownership using the player profile.',
    clientSummary: 'The client can locate and wait for its own plot, then attach local presentation and UI.',
    capabilities: ['Claim lifecycle', 'Owner lookups', 'Local plot access'],
    language: 'Luau',
    serverCode: `local plot = PlotService.getFreePlot()
if not plot then return end

plot:claim(profile)

plot:onClaimed(function(userId)
    -- Start plot-specific behavior.
end)`,
    clientCode: `local plot = PlotService.getLocalPlot()
if plot then
    local plotModel = plot:getInstance()
end

PlotService.onLocalPlot(function(localPlot)
    -- Attach the local plot UI.
end)`,
  },
  {
    id: 'products',
    name: 'ProductsService',
    category: 'MONETIZATION',
    summary: 'A runtime-aware interface for product and gamepass data, purchase prompts, confirmation callbacks, and ownership checks.',
    serverSummary: 'Server code binds game-specific benefits, checks ownership, and handles purchase confirmations.',
    clientSummary: 'Client code reads configured item data, opens purchase prompts, and reacts to completion.',
    capabilities: ['Developer products', 'Gamepasses', 'Purchase callbacks'],
    language: 'Luau',
    serverCode: `local gamepassName = "VIP"
local data = ProductsService:GetGamepassData(gamepassName)
if not data then return end

local unbind = ProductsService:Bind(player, gamepassName, function()
    grantVIPAccess(player) -- Game-specific benefit logic.
end)

local purchase = ProductsService:PromptPurchase(player, gamepassName)
if not purchase then
    unbind()
    return
end

purchase:awaitAndCall(function(wasPurchased)
    if not wasPurchased then unbind() end
end)`,
    clientCode: `local gamepassName = "VIP"
local data = ProductsService:GetGamepassData(gamepassName)
if not data then return end

local purchase = ProductsService:PromptPurchase(player, gamepassName)
if not purchase then return end

purchase:awaitAndCall(function(wasPurchased)
    if wasPurchased then
        showVIPUnlocked() -- Client-side feedback.
    end
end)`,
  },
  {
    id: 'autoloader',
    name: 'AutoLoader',
    category: 'BOOTSTRAP',
    summary:
      'Discovers modules under a root, initializes them, starts them in a second phase, and handles modules added later.',
    serverSummary: 'The server loads its service tree in a predictable init-then-start lifecycle.',
    clientSummary: 'The client uses the same lifecycle pattern to bootstrap controllers and client modules.',
    capabilities: ['AutoInit phase', 'AutoStart phase', 'Late module discovery'],
    language: 'Luau',
    serverCode: `function AutoLoader.LoadAll(root: Instance)
    AutoLoader.InitAll(root):andThen(function()
        return AutoLoader.StartAll(root)
    end)
end`,
    clientCode: `function AutoLoader.LoadAll(root: Instance)
    AutoLoader.InitAll(root):andThen(function()
        return AutoLoader.StartAll(root)
    end)
end`,
  },
]
