"use client";

import { forwardRef } from "react";
import ClassicCard from "./templates/ClassicCard";
import { CardProps } from "@/lib/types";
import { bandsFor, extrasFor, getTemplate } from "@/lib/templates";

/**
 * Memilih layout sesuai template yang dipakai murid ini.
 * Layout baru cukup ditambahkan sebagai cabang di sini.
 */
const ReportCard = forwardRef<HTMLDivElement, CardProps>(function ReportCard(
  { data, brand },
  ref
) {
  const template = getTemplate(data.templateId);
  const bands = bandsFor(brand, template.id);
  const extras = extrasFor(data.extras, template.id);
  const blocks = (template.extraBlocks ?? []).map((def) => ({
    def,
    cells: extras[def.id] ?? [],
  }));

  switch (template.layout) {
    case "classic":
    default:
      return (
        <ClassicCard
          ref={ref}
          data={data}
          brand={brand}
          theme={template.theme}
          rows={template.rows}
          bands={bands}
          footerText={template.footerText}
          levelFallback={template.defaultLevel}
          captionRow={template.captionRow}
          blocks={blocks}
        />
      );
  }
});

export default ReportCard;
