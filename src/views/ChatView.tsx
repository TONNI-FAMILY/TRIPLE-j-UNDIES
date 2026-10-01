import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';

export const ChatView: React.FC = () => {
  const {
    chatThreads,
    activeThreadId,
    setActiveThreadId,
    createNewChatThread,
    sendChatMessage,
    acceptCuratedBundle,
    openProductDetails,
    addToCart,
    cart,
    cartCount,
    showToast,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [threadSearch, setThreadSearch] = useState('');
  const [showPhonePolicyModal, setShowPhonePolicyModal] = useState(false);
  const [acceptedProposals, setAcceptedProposals] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeThread =
    chatThreads.find((t) => t.id === activeThreadId) || chatThreads[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages, activeThread?.isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt);
  };

  const handleNewQuestionClick = () => {
    createNewChatThread('General Sizing & Fabric Inquiry');
  };

  const handleAcceptBundle = (threadId: string, messageId: string) => {
    if (acceptedProposals.includes(messageId)) return;
    setAcceptedProposals((prev) => [...prev, messageId]);
    acceptCuratedBundle(threadId, messageId);
  };

  const handleShareCart = () => {
    if (cart.length === 0) {
      showToast('Your bag is currently empty. Add products to share.', 'info');
      return;
    }
    const cartSummary = cart
      .map((item) => `${item.quantity}x ${item.product.name} (${item.selectedSize}, ${item.selectedColor.name})`)
      .join(', ');
    sendChatMessage(`I'm currently reviewing my cart with: ${cartSummary}. Can you verify the sizing for these pieces?`);
  };

  const filteredThreads = chatThreads.filter((t) =>
    t.title.toLowerCase().includes(threadSearch.toLowerCase()) ||
    t.lastMessagePreview.toLowerCase().includes(threadSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col flex-1 w-full">
      {/* Editorial Care Banner */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#d9c1be]/40 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#506355]"></span>
            <p className="font-sans text-xs text-[#506355] uppercase tracking-wider font-semibold">
              Direct Concierge Service
            </p>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#201a18] font-normal">
            Underwear &amp; Fabric Consultation
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#534340]">
          <span className="material-symbols-outlined text-base text-[#506355]">
            verified_user
          </span>
          <span>Discreet &amp; Secure In-App Messaging • No External Logins</span>
        </div>
      </div>

      {/* 2-Column Split View Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start min-h-[720px]">
        {/* LEFT SIDEBAR: Inquiries & Conversations List (4 Columns) */}
        <aside className="lg:col-span-4 bg-[#ffffff] rounded-2xl border border-[#d9c1be]/50 p-4 flex flex-col gap-4 shadow-xs h-full">
          {/* Search & Action Header */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#867370] text-lg pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search chats or inquiries..."
                value={threadSearch}
                onChange={(e) => setThreadSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#fef1ed] border border-[#d9c1be]/50 rounded-full focus:outline-hidden focus:ring-1 focus:ring-[#8c493f] text-[#201a18]"
              />
            </div>
            <button
              onClick={handleNewQuestionClick}
              className="bg-[#f8ebe8] text-[#8c493f] text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#8c493f] hover:text-[#ffffff] transition-all active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer"
              title="Start new question"
            >
              <span className="material-symbols-outlined text-sm">edit_square</span>
              <span className="hidden sm:inline">New Question</span>
            </button>
          </div>

          {/* Active Sessions Counter */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#867370] px-1 uppercase tracking-wider">
            <span>ACTIVE SESSIONS</span>
            <span>{chatThreads.length} THREADS</span>
          </div>

          {/* Chat List Items */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[460px] pr-1">
            {filteredThreads.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#867370] space-y-1">
                <span className="material-symbols-outlined text-xl text-[#d9c1be]">search_off</span>
                <p>No conversations found</p>
                <button
                  onClick={() => setThreadSearch('')}
                  className="text-[#8c493f] text-[11px] underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              filteredThreads.map((thread) => {
              const isActive = thread.id === activeThreadId;
              const hasPinned = !!thread.pinnedProduct;

              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-[#fef1ed] border-[#8c493f]/40 shadow-xs'
                      : 'bg-[#ffffff] hover:bg-[#f8ebe8] border-transparent hover:border-[#d9c1be]/40'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#8c493f] rounded-r"></div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          thread.type === 'concierge'
                            ? 'bg-[#aa6055] text-[#ffffff]'
                            : thread.type === 'order'
                            ? 'bg-[#d2e8d6] text-[#384b3e]'
                            : 'bg-[#ece0dc] text-[#534340]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {thread.type === 'concierge'
                            ? 'support_agent'
                            : thread.type === 'order'
                            ? 'local_shipping'
                            : 'check_circle'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-sans text-xs font-semibold text-[#201a18] truncate leading-tight">
                          {thread.title}
                        </h2>
                        {thread.isTyping ? (
                          <p className="text-[11px] text-[#8c493f] flex items-center gap-1 mt-0.5">
                            <span className="inline-flex gap-0.5">
                              <span className="w-1.5 h-1.5 bg-[#8c493f] rounded-full animate-bounce"></span>
                              <span className="w-1.5 h-1.5 bg-[#8c493f] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                              <span className="w-1.5 h-1.5 bg-[#8c493f] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </span>
                            Sarah is typing...
                          </p>
                        ) : (
                          <p className="text-[11px] text-[#534340] truncate max-w-[190px] mt-0.5">
                            {thread.lastMessagePreview}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-[#867370] shrink-0 font-medium">
                      {thread.lastMessageTime}
                    </span>
                  </div>

                  {/* Contextual Product Pill Preview */}
                  {hasPinned && (
                    <div className="mt-2.5 pt-2 border-t border-[#d9c1be]/30 flex items-center justify-between text-xs text-[#534340]">
                      <span className="flex items-center gap-1 truncate text-[11px]">
                        <span className="material-symbols-outlined text-xs text-[#8c493f]">
                          shopping_basket
                        </span>
                        {thread.pinnedProduct?.product.name}
                      </span>
                      <span className="text-[10px] bg-[#fff8f6] text-[#506355] font-semibold px-2 py-0.5 rounded-full border border-[#d9c1be]/40">
                        In Cart ({cartCount})
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

          {/* Privacy & Direct Brand Reassurance Box */}
          <div className="mt-auto p-4 rounded-2xl bg-[#f8ebe8] border border-[#d9c1be]/50 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#8c493f] text-xs font-semibold">
              <span className="material-symbols-outlined text-base">lock</span>
              Private In-House Care
            </div>
            <p className="text-[11px] text-[#534340] leading-relaxed">
              Your fit measurements and intimate apparel selections are kept strictly private
              inside the Triple J encrypted environment.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-[#d9c1be]/40 text-[10px] text-[#867370]">
              <span>Triple J Guarantee</span>
              <span className="text-[#506355] font-semibold">100% Fit Guarantee</span>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN PANEL: Active Direct Chat Interface (8 Columns) */}
        <section className="lg:col-span-8 bg-[#ffffff] rounded-2xl border border-[#d9c1be]/50 flex flex-col shadow-xs overflow-hidden h-full min-h-[720px]">
          {/* Chat Header */}
          <div className="px-5 py-3.5 bg-[#fff8f6] border-b border-[#d9c1be]/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex -space-x-2 overflow-hidden">
                <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#fff8f6] bg-[#f2e6e2] flex items-center justify-center text-[#8c493f] font-bold text-xs">
                  SL
                </div>
                <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#fff8f6] bg-[#8c493f] text-[#ffffff] flex items-center justify-center font-bold text-xs">
                  TJ
                </div>
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-[#506355] ring-2 ring-[#fff8f6]"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-sans text-sm font-semibold text-[#201a18]">
                    Triple J Team (Sarah &amp; Leah)
                  </h3>
                  <span className="bg-[#d2e8d6] text-[#384b3e] text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#506355]"></span>
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-[#867370]">
                  Fit Specialists • Typically replies in 2 mins
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPhonePolicyModal(true)}
                className="px-3 py-1.5 rounded-full border border-[#d9c1be] text-[#534340] text-xs font-medium hover:bg-[#f8ebe8] transition-colors flex items-center gap-1 cursor-pointer"
                title="View In-App Security Guidelines"
              >
                <span className="material-symbols-outlined text-sm">policy</span>
                <span>View Phone Policy (In-App Only)</span>
              </button>
              <button
                onClick={handleShareCart}
                className="px-3 py-1.5 rounded-full bg-[#f8ebe8] text-[#8c493f] text-xs font-semibold hover:bg-[#8c493f] hover:text-[#ffffff] transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
                title="Synchronize current active shopping bag"
              >
                <span className="material-symbols-outlined text-sm">shopping_cart_checkout</span>
                <span>Share Cart ({cartCount})</span>
              </button>
            </div>
          </div>

          {/* Pinned Contextual Product Bar */}
          {activeThread.pinnedProduct && (
            <div className="bg-[#fef1ed]/90 backdrop-blur-xs border-b border-[#d9c1be]/40 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-14 rounded-lg bg-[#ffffff] border border-[#d9c1be]/60 overflow-hidden shrink-0 relative">
                  <img
                    src={activeThread.pinnedProduct.product.images[0]}
                    alt={activeThread.pinnedProduct.product.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-[#8c493f] text-[#ffffff] text-[8px] font-bold px-1 rounded-tl">
                    {activeThread.pinnedProduct.selectedSize}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold bg-[#f2e6e2] text-[#201a18] px-1.5 py-0.5 rounded uppercase">
                      Pinned Fit Subject
                    </span>
                    <span className="font-sans text-xs font-semibold text-[#201a18]">
                      {activeThread.pinnedProduct.product.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#867370] mt-0.5">
                    ${activeThread.pinnedProduct.product.price}.00 •{' '}
                    <span className="text-[#201a18] font-medium">Selected Size:</span>{' '}
                    {activeThread.pinnedProduct.selectedSize} •{' '}
                    <span className="text-[#201a18] font-medium">Color:</span>{' '}
                    {activeThread.pinnedProduct.selectedColor.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => openProductDetails(activeThread.pinnedProduct!.product)}
                  className="px-3 py-1.5 rounded-full border border-[#d9c1be] text-[#201a18] text-xs font-semibold hover:bg-[#ffffff] transition-colors active:scale-95 cursor-pointer"
                >
                  View Product Details
                </button>
                <button
                  onClick={() =>
                    addToCart(
                      activeThread.pinnedProduct!.product,
                      activeThread.pinnedProduct!.selectedSize,
                      activeThread.pinnedProduct!.selectedColor
                    )
                  }
                  className="px-4 py-1.5 rounded-full bg-[#8c493f] text-[#ffffff] text-xs font-semibold hover:bg-[#aa6055] transition-all active:scale-95 shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>+ Add to Cart (${activeThread.pinnedProduct.product.price})</span>
                </button>
              </div>
            </div>
          )}

          {/* Conversation Timeline Canvas */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-5 bg-gradient-to-b from-[#fff8f6]/40 to-[#ffffff] max-h-[500px]">
            <div className="text-center my-2">
              <span className="text-[11px] font-medium text-[#867370] bg-[#f8ebe8] px-3.5 py-1 rounded-full border border-[#d9c1be]/40">
                Today • Intimate Fit Session #8492
              </span>
            </div>

            {activeThread.messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';

              if (isCustomer) {
                return (
                  <div key={msg.id} className="flex flex-col items-end max-w-lg ml-auto">
                    <div className="bg-[#8c493f] text-[#ffffff] rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs">
                      <p className="text-xs text-[#ffffff] leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-[#867370] mt-1 mr-1">
                      Customer • {msg.timeLabel}
                    </span>
                  </div>
                );
              }

              // Specialist reply
              return (
                <div key={msg.id} className="flex items-start gap-3 max-w-xl">
                  <div className="w-8 h-8 rounded-full bg-[#aa6055] text-[#ffffff] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    {msg.authorAvatar || 'S'}
                  </div>
                  <div className="flex flex-col items-start w-full">
                    <div className="bg-[#fef1ed] border border-[#d9c1be]/40 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs text-[#201a18] w-full">
                      <div className="flex items-center gap-1.5 mb-1 text-[#8c493f] text-xs font-semibold">
                        <span>{msg.authorName || 'Sarah'}</span>
                        <span>•</span>
                        <span className="text-[#867370] font-normal">
                          {msg.authorRole || 'Fabric & Fit Specialist'}
                        </span>
                      </div>
                      <p className="text-xs text-[#201a18] leading-relaxed">{msg.text}</p>

                      {/* Interactive Curated Bundle Card */}
                      {msg.bundleProposal && (
                        <div className="mt-3 bg-[#ffffff] border-2 border-[#aa6055]/30 rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center justify-between pb-3 border-b border-[#d9c1be]/40">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[#8c493f] text-base">
                                receipt_long
                              </span>
                              <span className="text-xs font-bold text-[#201a18]">
                                {msg.bundleProposal.title}
                              </span>
                            </div>
                            <span className="bg-[#d2e8d6] text-[#384b3e] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              {msg.bundleProposal.discountBadge}
                            </span>
                          </div>

                          <div className="py-3 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-[#201a18] font-medium">
                                {msg.bundleProposal.summary}
                              </span>
                              <span className="font-bold text-[#201a18]">
                                ${msg.bundleProposal.bundlePrice.toFixed(2)}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#534340] pl-2 border-l-2 border-[#aa6055] space-y-0.5">
                              {msg.bundleProposal.items.map((it, idx) => (
                                <p key={idx}>• {it}</p>
                              ))}
                            </div>
                            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#506355] font-medium">
                              <span className="material-symbols-outlined text-xs">local_shipping</span>
                              <span>Qualifies for Free Carbon-Neutral Shipping</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#d9c1be]/40 flex items-center justify-between gap-3">
                            <div className="text-xs">
                              <span className="text-[#867370] line-through">
                                ${msg.bundleProposal.regularPrice.toFixed(2)}
                              </span>
                              <span className="text-sm font-bold text-[#8c493f] ml-1.5">
                                ${msg.bundleProposal.bundlePrice.toFixed(2)}
                              </span>
                            </div>
                            <button
                              onClick={() => handleAcceptBundle(activeThread.id, msg.id)}
                              disabled={acceptedProposals.includes(msg.id)}
                              className={`text-xs font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1 shadow-xs ${
                                acceptedProposals.includes(msg.id)
                                  ? 'bg-[#d2e8d6] text-[#384b3e] cursor-default'
                                  : 'bg-[#8c493f] text-[#ffffff] hover:bg-[#aa6055] active:scale-95 cursor-pointer'
                              }`}
                            >
                              <span>
                                {acceptedProposals.includes(msg.id)
                                  ? 'Bundle Added to Bag & Checkout'
                                  : 'Accept & Review in Checkout'}
                              </span>
                              <span className="material-symbols-outlined text-xs">
                                {acceptedProposals.includes(msg.id) ? 'check' : 'arrow_forward'}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-[#867370] mt-1 ml-1">
                      Triple J Care • {msg.timeLabel}
                    </span>
                  </div>
                </div>
              );
            })}

            {activeThread.isTyping && (
              <div className="flex items-start gap-3 max-w-xl">
                <div className="w-8 h-8 rounded-full bg-[#aa6055] text-[#ffffff] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  S
                </div>
                <div className="bg-[#fef1ed] border border-[#d9c1be]/40 rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-[#8c493f] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#8c493f] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#8c493f] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#8c493f] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="ml-1 text-[#534340]">Sarah is preparing fit advice...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Guidance Suggestion Chips */}
          <div className="px-4 py-2 bg-[#fff8f6] border-t border-[#d9c1be]/30 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-semibold text-[#867370] shrink-0">Quick prompts:</span>
            {[
              'Is bulk ordering available?',
              'When will my order ship?',
              'Can I exchange sizes?',
              'Send size chart',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="shrink-0 text-xs px-3 py-1 rounded-full bg-[#f8ebe8] text-[#201a18] hover:bg-[#ffdad4] transition-colors border border-[#d9c1be]/40 active:scale-95 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Rich Input Interaction Bar */}
          <div className="p-4 bg-[#fff8f6] border-t border-[#d9c1be]/40">
            <form onSubmit={handleSend} className="flex items-end gap-2">
              <div className="flex items-center gap-1 pb-1">
                <button
                  type="button"
                  onClick={() =>
                    showToast('Photo attachment encrypted and added to consultation', 'attach_file')
                  }
                  className="p-2 text-[#867370] hover:text-[#201a18] rounded-full hover:bg-[#f8ebe8] transition-colors cursor-pointer"
                  title="Attach fit question photo"
                >
                  <span className="material-symbols-outlined text-lg">attach_file</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputText((prev) => prev + ' ✨ ')}
                  className="p-2 text-[#867370] hover:text-[#201a18] rounded-full hover:bg-[#f8ebe8] transition-colors cursor-pointer"
                  title="Insert symbol"
                >
                  <span className="material-symbols-outlined text-lg">sentiment_satisfied</span>
                </button>
              </div>

              <div className="flex-1 bg-[#ffffff] border border-[#d9c1be]/70 rounded-2xl focus-within:ring-2 focus-within:ring-[#8c493f]/20 focus-within:border-[#8c493f] transition-all p-2 flex items-center gap-2">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (textareaRef.current) {
                      textareaRef.current.style.height = 'auto';
                      textareaRef.current.style.height = `${Math.min(96, textareaRef.current.scrollHeight)}px`;
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about products, sizing, or orders..."
                  rows={1}
                  className="w-full bg-transparent border-0 focus:ring-0 text-xs text-[#201a18] placeholder:text-[#867370] resize-none max-h-24 p-1 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-[#8c493f] text-[#ffffff] text-xs font-semibold px-5 py-3 rounded-full hover:bg-[#aa6055] transition-all active:scale-95 shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-40"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>

            <div className="flex items-center justify-between px-2 pt-2 text-[10px] text-[#867370]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#506355]">lock</span>
                Encrypted direct customer connection
              </span>
              <span>Press Enter to send</span>
            </div>
          </div>
        </section>
      </div>

      {/* Reassurance Bento Grid (Tactile Minimalist Benefits) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#fef1ed] border border-[#d9c1be]/40 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#8c493f]/10 text-[#8c493f] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base">fit_screen</span>
          </div>
          <div>
            <h4 className="font-sans text-xs font-semibold text-[#201a18]">
              30-Day First Pair Guarantee
            </h4>
            <p className="text-[11px] text-[#534340] mt-0.5">
              If your first size doesn't feel extraordinary, keep it and we'll ship the correct size on us.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#fef1ed] border border-[#d9c1be]/40 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#8c493f]/10 text-[#8c493f] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base">inventory_2</span>
          </div>
          <div>
            <h4 className="font-sans text-xs font-semibold text-[#201a18]">
              100% Discreet Packaging
            </h4>
            <p className="text-[11px] text-[#534340] mt-0.5">
              Recycled unmarked kraft mailers protecting personal privacy from our door to yours.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#fef1ed] border border-[#d9c1be]/40 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#8c493f]/10 text-[#8c493f] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base">eco</span>
          </div>
          <div>
            <h4 className="font-sans text-xs font-semibold text-[#201a18]">
              Conscious Botanicals
            </h4>
            <p className="text-[11px] text-[#534340] mt-0.5">
              Austrian beechwood modal and GOTS certified organic blends dyed without harsh chemicals.
            </p>
          </div>
        </div>
      </div>

      {/* Phone Policy Modal */}
      {showPhonePolicyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setShowPhonePolicyModal(false)}
            className="fixed inset-0 bg-[#201a18]/50 backdrop-blur-xs"
          />
          <div className="relative bg-[#ffffff] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#d9c1be] z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d9c1be]/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8c493f]">policy</span>
                <h3 className="font-serif text-xl text-[#201a18]">In-App Concierge Policy</h3>
              </div>
              <button
                onClick={() => setShowPhonePolicyModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f8ebe8] text-[#867370]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <p className="text-xs text-[#534340] leading-relaxed">
              To protect both our craftspeople and customer privacy, Triple J Undies conducts all
              sizing advice and order inquiries strictly through our authenticated in-app concierge.
            </p>
            <div className="space-y-2 text-xs text-[#534340]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#506355] text-sm">check</span>
                <span>Zero unsolicited phone calls or marketing SMS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#506355] text-sm">check</span>
                <span>Direct access to master fitting specialists (Sarah &amp; Leah)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#506355] text-sm">check</span>
                <span>Seamless connection between conversations, orders, and cart items</span>
              </div>
            </div>
            <button
              onClick={() => setShowPhonePolicyModal(false)}
              className="w-full py-2.5 rounded-full bg-[#8c493f] text-[#ffffff] text-xs font-semibold hover:bg-[#aa6055] transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
