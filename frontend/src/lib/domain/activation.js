export function activationLink({ pathname, search, hash }) {
  const query = new URLSearchParams(search);
  const fragment = new URLSearchParams(hash.slice(1));
  const challengeId = fragment.get('challenge_id') ?? query.get('challenge_id');
  const token = fragment.get('token') ?? query.get('token');
  query.delete('challenge_id');
  query.delete('token');
  return { challengeId, token, cleanPath: query.size ? `${pathname}?${query}` : pathname };
}

export function isActivationCandidate(user, organizationUid) {
  return user.uid_organization === organizationUid &&
    ['administrator', 'secondary_admin'].includes(user.profile_code) &&
    user.enabled === false && user.password_initialized === false &&
    Boolean(user.email?.trim());
}
