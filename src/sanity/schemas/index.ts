import seo from "./seo";
import author from "./author";
import category from "./category";
import post from "./post";
import page from "./page";
import pageSeo from "./pageSeo";
import siteSettings from "./siteSettings";
import redirect from "./redirect";
import dataTable from "./dataTable";

export const schemaTypes = [
  siteSettings,
  seo,
  page,
  pageSeo,
  redirect,
  author,
  category,
  dataTable,
  post,
];
