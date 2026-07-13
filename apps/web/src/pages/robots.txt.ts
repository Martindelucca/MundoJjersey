import type { APIRoute } from 'astro';
import { buildRobotsTxt } from '../lib/seo';

export const prerender = true;

export const GET: APIRoute = ({ url, site }) => new Response(
  buildRobotsTxt(site || import.meta.env.PUBLIC_SITE_URL || url.origin),
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
);
