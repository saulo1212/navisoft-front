'use client'
import avatar from '@/assets/img/demo/avatars/avatar-b.png'
import gallery3 from '@/assets/img/demo/gallery/3.jpg'
import { basePath } from '@/helpers'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Dropdown, DropdownMenu, DropdownToggle } from 'react-bootstrap'
import ChatListView from './ChatListView'

type MessageSegment = {
  id: string
  type: 'sent' | 'get'
  messages?: string[]
  time?: string
  isStart?: boolean
  isEnd?: boolean
  delay?: number
  image?: StaticImageData
  isEmojiOnly?: boolean
  emojiType?: string
}

const ChatView = () => {
  const [messages, setMessages] = useState<MessageSegment[]>([
    {
      id: '0',
      type: 'get',
      messages: ["Hi there! How's your day going?"],
      time: '15:24',
    },
    {
      id: '1',
      type: 'sent',
      messages: ['Pretty good, thanks for asking! Just finished a big project.'],
      time: '15:24',
    },
    {
      id: '2',
      type: 'get',
      messages: ["That's great to hear! Is this the same one you mentioned last week?"],
      time: '15:25',
    },
    {
      id: '3',
      type: 'sent',
      messages: ['Yes, finally wrapped it up. The client was really happy with the results.'],
      isStart: true,
      time: '15:25',
    },
    {
      id: '4',
      type: 'get',
      messages: ["Thanks for sharing the document! I'll take a look at it."],
      time: '15:26',
      isEnd: true,
    },
    {
      id: '5',
      type: 'sent',
      messages: ['Let me know if you need any clarification.'],
      isStart: true,
      time: '15:26',
    },
    {
      id: '6',
      type: 'get',
      image: gallery3,
      time: '15:26',
    },
    {
      id: '7',
      type: 'sent',
      messages: ['That looks amazing! Is that from the project?'],
      isEnd: true,
      time: '15:26',
    },
    {
      id: '8',
      type: 'get',
      messages: ["Yes, it's the final design we went with 😊"],
      isEnd: true,
      time: '15:27',
    },
  ])

  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const mockResponses = [
    "That's interesting. Tell me more.",
    'I completely understand what you mean.',
    "I hadn't thought about it that way before.",
    "That's great news!",
    "LOL 😂 That's hilarious!",
    "Really? I'm surprised to hear that.",
    "Wow! That's amazing! 👍",
    'So how are you liking SmartAdmin?',
  ]

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const getCurrentTime = (): string => {
    const now = new Date()
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
  }

  const triggerBotResponse = () => {
    setIsTyping(true)
    const responseDelay = 1000 + Math.random() * 2000

    setTimeout(() => {
      setIsTyping(false)
      const responseType = Math.random()

      if (responseType < 0.7) {
        const randomText = mockResponses[Math.floor(Math.random() * mockResponses.length)]
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'get',
            messages: [randomText],
            time: getCurrentTime(),
          },
        ])
      } else {
        const animatedEmojis = ['like', 'love', 'haha', 'yay', 'wow', 'sad', 'angry']
        const randomEmojiType = animatedEmojis[Math.floor(Math.random() * animatedEmojis.length)]
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'get',
            time: getCurrentTime(),
            isEmojiOnly: true,
            emojiType: randomEmojiType,
          },
        ])
      }
    }, responseDelay)
  }

  const handleSendMessage = (customContent?: { isEmojiOnly: boolean; emojiType: string }) => {
    if (!customContent && !inputValue.trim()) return

    const newMsg: MessageSegment = customContent
      ? {
          id: Date.now().toString(),
          type: 'sent',
          time: getCurrentTime(),
          isEmojiOnly: true,
          emojiType: customContent.emojiType,
        }
      : {
          id: Date.now().toString(),
          type: 'sent',
          messages: [inputValue.trim()],
          time: getCurrentTime(),
        }

    setMessages((prev) => [...prev, newMsg])
    if (!customContent) setInputValue('')

    triggerBotResponse()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .typing { display: flex; align-items: center; height: 17px; }
        .typing span { background-color: #90949c; width: 7px; height: 7px; border-radius: 50%; margin: 0 2px; display: block; animation: typing 1.3s infinite ease-in-out; }
        .typing span:nth-child(1) { animation-delay: 0s; }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
        
        /* Fixed Animated Emoji Placement Mechanics */
        .chat-segment .emoji { transform: scale(1.6); margin: 16px; display: inline-block; }
        .chat-segment-sent .emoji-wrapper { display: flex; flex-direction: column; align-items: flex-end; width: 100%; }
        .chat-segment-get .emoji-wrapper { display: flex; flex-direction: column; align-items: flex-start; width: 100%; }
      `,
        }}
      />

      <div
        className="d-flex flex-column flex-grow-1 flex-0 overflow-x-auto h-100"
        style={{ minHeight: 'calc(100vh - (var(--app-header-height) + 56px))' }}>
        <div className="d-flex align-items-center p-0 border-faded border-top-0 border-start-0 border-end-0 flex-shrink-0">
          <div className="d-flex align-items-center w-100 ps-3 px-lg-5 py-2 position-relative">
            <div className="d-flex flex-row align-items-center mt-1 mb-1">
              <div className="me-2 d-inline-block">
                <span
                  className="rounded-circle profile-image d-block position-relative status status-success"
                  style={{ backgroundImage: `url(${avatar.src})`, backgroundSize: 'cover' }}
                />
              </div>
              <div className="info-card-text">
                <div className="text-truncate text-truncate-lg">Oliver Kopyov</div>
                <small className="text-muted text-truncate text-truncate-md">Online</small>
              </div>
            </div>
            <div className="d-flex flex-row gap-2 ms-auto">
              <button className="btn btn-icon rounded-circle">
                <svg className="sa-icon sa-icon-2x sa-bold sa-icon-subtlelight">
                  <use href={`${basePath}/icons/sprite.svg#phone`} />
                </svg>
              </button>
              <button className="btn btn-icon rounded-circle">
                <svg className="sa-icon sa-icon-2x sa-bold sa-icon-subtlelight sa-nofill">
                  <use href={`${basePath}/icons/sprite.svg#video`} />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="btn btn-icon rounded-circle d-flex d-lg-none me-4 position-relative border-0 bg-transparent">
                <span className="badge bg-danger rounded-circle position-absolute top-0 end-0 m-n1" style={{ fontSize: '0.65rem', padding: '0.25em 0.45em' }}>4</span>
                <svg className="sa-icon sa-icon-2x sa-bold sa-icon-subtlelight" style={{ width: '22px', height: '22px' }}>
                  <use href={`${basePath}/icons/sprite.svg#message-circle`} />
                </svg>
              </button>
             
            </div>
          </div>
        </div>

        <div className="flex-wrap align-items-center flex-grow-1 position-relative bg-gray-50">
          <div className="msgr position-absolute top-0 bottom-0 w-100 overflow-hidden d-flex flex-column">
            <div
              ref={chatContainerRef}
              id="chat_container"
              className="w-100 p-4 px-lg-5 bg-subtlelight-fade custom-scroll flex-grow-1"
              style={{ overflowY: 'auto' }}>
              <div className="alert bg-warning bg-opacity-10 opacity-75 border border-warning border-opacity-50 fs-nano px-3 py-2">
                Protect your privacy by never sharing personal details like your phone number, email, or passwords. Stay alert for scams, suspicious
                links, or requests for money, and report any inappropriate behavior immediately. Avoid hate speech, harassment, or any illegal
                activities, as they are strictly prohibited. For all other rules, please refer to the{' '}
                <Link href="" target="_blank">
                  Terms of Service
                </Link>
                .
              </div>

              <div className="chat-segment d-flex justify-content-center">
                <div className="time-stamp text-center my-2 fw-400 badge bg-secondary text-white">Jun 20</div>
              </div>

              {messages.map((msg) => {
                const segmentClass = `chat-segment chat-segment-${msg.type}${msg.isStart ? ' chat-start' : ''}${msg.isEnd ? ' chat-end' : ''}`
                return (
                  <div key={msg.id} className={`${segmentClass} mb-3`}>
                    {msg.isEmojiOnly && msg.emojiType ? (
                      <div className="emoji-wrapper">
                        <div className={`emoji emoji--${msg.emojiType}`}>
                          {msg.emojiType === 'like' && (
                            <div className="emoji__hand">
                              <div className="emoji__thumb" />
                            </div>
                          )}
                          {msg.emojiType === 'love' && <div className="emoji__heart" />}
                          {msg.emojiType === 'haha' && (
                            <div className="emoji__face">
                              <div className="emoji__eyes" />
                              <div className="emoji__mouth">
                                <div className="emoji__tongue" />
                              </div>
                            </div>
                          )}
                          {(msg.emojiType === 'yay' || msg.emojiType === 'wow' || msg.emojiType === 'sad' || msg.emojiType === 'angry') && (
                            <div className="emoji__face">
                              <div className="emoji__eyebrows" />
                              {msg.emojiType !== 'yay' && <div className="emoji__eyes" />}
                              <div className="emoji__mouth" />
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="chat-message">
                        {msg.messages?.map((text, idx) => (
                          <p key={idx} className="mb-0">
                            {text}
                          </p>
                        ))}
                        {msg.image && (
                          <div className="mt-1">
                            <Image
                              src={msg.image}
                              className="img-fluid rounded"
                              alt="Shared content"
                              height={160}
                              style={{ width: 'auto', maxHeight: '200px' }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {msg.time && <div className={`${msg.type === 'sent' ? 'text-end ' : ''}fw-300 text-muted mt-1 fs-xs`}>{msg.time}</div>}
                  </div>
                )
              })}

              {isTyping && (
                <div className="chat-segment chat-segment-get">
                  <div className="chat-message bg-white border rounded-3 p-3 d-inline-block">
                    <div className="typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex flex-column border border-bottom-0 border-end-0 border-start-0">
              <div className="p-3 px-lg-4 d-flex gap-1">
                <div className="d-flex gap-1 flex-row align-items-center flex-wrap flex-shrink-0">
                  <Dropdown drop="up">
                    <DropdownToggle as="button" className=" content-none btn btn-icon fs-xl">
                      <svg className="sa-icon sa-bold sa-icon-subtlelight">
                        <use href={`${basePath}/icons/sprite.svg#smile`} />
                      </svg>
                    </DropdownToggle>

                    <DropdownMenu className="text-center rounded-pill overflow-hidden ">
                      <div className="d-flex align-items-center px-2 py-0 gap-1">
                        <Link
                          onClick={() => handleSendMessage({ isEmojiOnly: true, emojiType: 'like' })}
                          href=""
                          className="emoji emoji--like"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Like">
                          <div className="emoji__hand">
                            <div className="emoji__thumb" />
                          </div>
                        </Link>
                        <Link
                          href=""
                          onClick={() => handleSendMessage({ isEmojiOnly: true, emojiType: 'love' })}
                          className="emoji emoji--love"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Love">
                          <div className="emoji__heart" />
                        </Link>

                        <Link
                          href=""
                          onClick={() => handleSendMessage({ isEmojiOnly: true, emojiType: 'haha' })}
                          className="emoji emoji--haha"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Haha">
                          <div className="emoji__face">
                            <div className="emoji__eyes" />
                            <div className="emoji__mouth">
                              <div className="emoji__tongue" />
                            </div>
                          </div>
                        </Link>
                        <Link
                          onClick={() => handleSendMessage({ isEmojiOnly: true, emojiType: 'yay' })}
                          href=""
                          className="emoji emoji--yay"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Yay">
                          <div className="emoji__face">
                            <div className="emoji__eyebrows" />
                            <div className="emoji__mouth" />
                          </div>
                        </Link>
                        <Link
                          onClick={() => handleSendMessage({ isEmojiOnly: true, emojiType: 'wow' })}
                          href=""
                          className="emoji emoji--wow"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-original-title="Wow">
                          <div className="emoji__face">
                            <div className="emoji__eyebrows" />
                            <div className="emoji__eyes" />
                            <div className="emoji__mouth" />
                          </div>
                        </Link>
                        <Link
                          href=""
                          className="emoji emoji--sad"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          onClick={() => handleSendMessage({ isEmojiOnly: true, emojiType: 'sad' })}
                          data-bs-original-title="Sad">
                          <div className="emoji__face">
                            <div className="emoji__eyebrows" />
                            <div className="emoji__eyes" />
                            <div className="emoji__mouth" />
                          </div>
                        </Link>
                        <Link
                          href=""
                          className="emoji emoji--angry"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          onClick={() => handleSendMessage({ isEmojiOnly: true, emojiType: 'angry' })}
                          data-bs-original-title="Angry">
                          <div className="emoji__face">
                            <div className="emoji__eyebrows" />
                            <div className="emoji__eyes" />
                            <div className="emoji__mouth" />
                          </div>
                        </Link>
                      </div>
                    </DropdownMenu>
                  </Dropdown>

                  <button className="btn btn-icon fs-xl" type="button">
                    <svg className="sa-icon sa-bold sa-icon-subtlelight">
                      <use href={`${basePath}/icons/sprite.svg#file`} />
                    </svg>
                  </button>
                </div>

                <input
                  id="msgr_input"
                  className="form-control"
                  placeholder="Type your message here..."
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="btn btn-icon fs-xl width-1 flex-shrink-0"
                  type="button"
                  data-bs-toggle="tooltip"
                  data-bs-original-title="Voice"
                  data-bs-placement="top">
                  <svg className="sa-icon sa-bold sa-icon-subtlelight">
                    <use href={`${basePath}/icons/sprite.svg#mic`} />
                  </svg>
                </button>

                <button id="send_button" className="btn btn-icon fs-xl width-1 flex-shrink-0" type="button" onClick={() => handleSendMessage()}>
                  <svg className="sa-icon sa-bold sa-icon-subtlelight">
                    <use href={`${basePath}/icons/sprite.svg#send`} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatListView isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}

export default ChatView
