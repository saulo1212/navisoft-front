'use client';

import avatarAdmin from '@/assets/img/demo/avatars/avatar-admin.png';
import avatarb from '@/assets/img/demo/avatars/avatar-b.png';
import avatare from '@/assets/img/demo/avatars/avatar-e.png';
import avatarh from '@/assets/img/demo/avatars/avatar-h.png';
import { basePath } from '@/helpers';
import React, { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Collapse } from 'react-bootstrap';
const initialPosts = [{
  id: 'post-1',
  author: {
    name: 'Sunny A.',
    avatar: avatarAdmin,
    votes: 140,
    stars: 4,
    isThreadOwner: true
  },
  timeAgo: '1 week ago',
  likes: 55,
  hasLiked: true,
  paragraphs: ['Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus quis sem diam. Sed commodo metus in ultrices consequat. Vestibulum eu orci ante. Mauris vel tincidunt mauris. Cras finibus, purus eu pharetra molestie, orci felis lacinia orci, ac congue quam turpis a nibh', 'Nam viverra diam magna, eget lobortis orci tincidunt sed. Donec et lobortis est. Morbi eget massa est. In iaculis odio lectus, sed efficitur nunc viverra non. Nullam molestie eros magna, eu posuere mauris posuere sit amet. Pellentesque hendrerit condimentum ipsum, euismod ornare lectus pharetra eget. Praesent semper est erat, commodo mollis arcu efficitur vitae. Maecenas gravida sit amet nisi vel interdum.', 'Vestibulum molestie, ipsum vitae feugiat lacinia, nisi magna accumsan velit, ac semper nisi felis vitae augue. Vivamus mattis quis erat eu gravida. Integer venenatis risus vitae ullamcorper cursus. Proin sodales odio sed aliquet pulvinar. Duis ipsum erat, ultricies a dolor non, tempor dictum ante. Morbi vel metus lectus']
}, {
  id: 'post-2',
  author: {
    name: 'Oliver Kopyov',
    avatar: avatarb,
    votes: 90,
    stars: 3
  },
  timeAgo: '4 days ago',
  likes: 0,
  hasLiked: false,
  subjectLine: 'RE: Package location',
  quoteText: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus quis sem diam. Sed commodo metus in ultrices consequat. Vestibulum eu orci ante. Mauris vel tincidunt mauris. Cras finibus, purus eu pharetra molestie, orci felis lacinia orci, ac congue quam turpis a nibh...',
  paragraphs: ['Proin vehicula nibh a nisl porta laoreet. Etiam quis massa quam. Etiam elementum nunc accumsan ullamcorper viverra. Sed aliquam ligula eu porta posuere. Nullam in dictum lacus. Nulla auctor hendrerit purus, sit amet lacinia tellus placerat nec. Nunc condimentum urna sit amet blandit egestas. Nam non placerat nisi. Sed sit amet massa porta, porttitor tellus porttitor, sagittis ex. Duis vitae dolor sit amet sem mattis molestie. Aliquam id pharetra leo.']
}, {
  id: 'post-3',
  author: {
    name: 'Dr. John Cook PhD',
    avatar: avatare,
    votes: 77,
    stars: 5
  },
  timeAgo: '2 days ago',
  likes: 0,
  hasLiked: false,
  replyTo: 'Oliver Kopyov',
  paragraphs: ['Proin vehicula nibh a nisl porta laoreet. Etiam quis massa quam. Etiam elementum nunc accumsan ullamcorper viverra. Sed aliquam ligula eu porta posuere. Nullam in dictum lacus. Nulla auctor hendrerit purus, sit amet lacinia tellus placerat nec. Nunc condimentum urna sit amet blandit egestas. Nam non placerat nisi. Sed sit amet massa porta, porttitor tellus porttitor, sagittis ex. Duis vitae dolor sit amet sem mattis molestie. Aliquam id pharetra leo.', 'Vivamus at sapien eget lorem suscipit laoreet. Donec tincidunt augue auctor, ullamcorper urna ac, bibendum odio. Donec ac facilisis mauris. Quisque egestas quam libero, in vulputate purus accumsan vitae']
}, {
  id: 'post-4',
  author: {
    name: 'Sarah McBrook',
    avatar: avatarh,
    votes: 146,
    stars: 5
  },
  timeAgo: '1 hour ago',
  likes: 3,
  hasLiked: true,
  subjectLine: 'RE: Package location',
  paragraphs: ['Curabitur sollicitudin eros eget nibh commodo posuere. Aenean non diam at massa accumsan elementum eget in arcu. Cras vestibulum ornare nulla, vel porttitor turpis tristique at. In laoreet eleifend dolor, ac eleifend nunc porttitor et. Praesent volutpat risus in metus lacinia porttitor']
}];
const Post = () => {
  const [openReplyBoxes, setOpenReplyBoxes] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const toggleReplyBox = postId => {
    setOpenReplyBoxes(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };
  const handleInputChange = (postId, value) => {
    setReplyInputs(prev => ({
      ...prev,
      [postId]: value
    }));
  };
  const handleQuickPostSubmit = postId => {
    console.log(`Submitting reply for ${postId}:`, replyInputs[postId]);
    handleInputChange(postId, '');
    toggleReplyBox(postId);
  };
  const renderStars = activeStars => {
    return Array.from({
      length: 5
    }, (_, index) => {
      const isGold = index < activeStars;
      return <svg key={index} className={`sa-icon ${isGold ? 'sa-icon-warning text-warning' : 'text-muted'} me-1`} style={{
        width: '14px',
        height: '14px'
      }}>
          <use href={`${basePath}/icons/sprite.svg#star`} />
        </svg>;
    });
  };
  return <>
      {initialPosts.map(post => <Card className="mb-g border shadow-0" id={post.id} key={post.id}>
          <CardHeader className="p-0">
            <div className="d-flex align-items-center justify-content-between p-3">
              <div className="d-flex align-items-center">
                <div className="d-block flex-shrink-0">
                  <img src={post.author.avatar.src} className="img-fluid img-thumbnail" alt={post.author.name} />
                </div>
                <div className="d-block ms-2">
                  {post.replyTo && <div className="h6 mb-1 small text-muted">
                      Replying to <span className="fw-bold text-primary cursor-pointer">{post.replyTo}</span>
                    </div>}
                  {post.subjectLine && <span className="h6 fw-bold d-block m-0 text-dark mb-1">{post.subjectLine}</span>}

                  <div className="d-flex align-items-center flex-wrap gap-1">
                    <span className="fs-sm h6 fw-500 mb-0 d-block">{post.author.name}</span>
                    {post.author.isThreadOwner && <span className="badge bg-primary ">Thread Owner</span>}
                  </div>

                  <div className="d-flex mt-1 align-items-center">
                    {renderStars(post.author.stars)}
                    <span className="text-muted fs-xs font-italic">({post.author.votes} votes)</span>
                  </div>
                </div>
              </div>
              <div className="d-inline-flex align-items-center ms-auto align-self-start cursor-pointer">
                {post.likes > 0 && <span className="fs-sm text-muted me-1">{post.likes}</span>}
                <i className={`${post.hasLiked ? 'fas fa-heart text-danger' : 'fal fa-heart text-muted'} ms-1`} />
              </div>
            </div>
          </CardHeader>

          <CardBody>
            {post.quoteText && <blockquote className="blockquote font-italic p-3 border-start border-3 border-secondary fs-sm text-muted rounded-end">
                {post.quoteText}
              </blockquote>}
            {post.paragraphs.map((paragraph, index) => <p key={index} className={index === post.paragraphs.length - 1 ? 'mb-0' : ''}>
                {paragraph}
              </p>)}
          </CardBody>

          <CardFooter className="bg-transparent">
            <div className="d-flex align-items-center">
              <span className="text-sm text-muted font-italic">
                <i className="fal fa-clock me-1" /> Posted {post.timeAgo}
              </span>
              <button type="button" className="btn btn-link text-decoration-none flex-shrink-0 ms-auto p-0 border-0" onClick={() => toggleReplyBox(post.id)} aria-expanded={!!openReplyBoxes[post.id]} aria-controls={`reply-box-${post.id}`}>
                Reply <i className="fal fa-reply ms-2" />
              </button>
            </div>

            <Collapse in={!!openReplyBoxes[post.id]}>
              <div id={`reply-box-${post.id}`}>
                <div className="pt-3">
                  <textarea className="form-control" placeholder="Quick reply..." rows={3} value={replyInputs[post.id] || ''} onChange={e => handleInputChange(post.id, e.target.value)} />
                  <div className="text-end pt-2">
                    <Button variant="success" size="sm" className="waves-effect" type="button" disabled={!(replyInputs[post.id] || '').trim()} onClick={() => handleQuickPostSubmit(post.id)}>
                      Quick Post
                    </Button>
                  </div>
                </div>
              </div>
            </Collapse>
          </CardFooter>
        </Card>)}
    </>;
};
export default Post;