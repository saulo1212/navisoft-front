'use client';

import { detailHref } from '@/lib/navigation/detailRoutes';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import ptBr from '@fullcalendar/core/locales/pt-br';
import { Alert, Button } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import AgendaNavigation from '@/components/admin/AgendaNavigation';
import DataTable from '@/components/admin/DataTable';
import ListToolbar from '@/components/admin/ListToolbar';
import FormModal from '@/components/admin/FormModal';
import { OperationalGate, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { getAgendaSettings, listAgenda, patchAgendaSettings } from '@/lib/api/endpoints/agenda';
import { agendaColorChanges, agendaEvent, PRIORITIES } from '@/lib/domain/agenda';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="agenda"><Agenda /></OperationalGate>; }
function Agenda() {
  const { token, selectedOrganizationUid } = useSession();
  const router = useRouter();
  const list = useOffsetList(listAgenda, { params: { organizationUid: selectedOrganizationUid } });
  const action = useOperationalAction();
  const [settings, setSettings] = useState(null);
  const [palette, setPalette] = useState(null);
  const [settingsError, setSettingsError] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    getAgendaSettings({ token, organizationUid: selectedOrganizationUid, signal: controller.signal }).then(result => { if (!controller.signal.aborted) setSettings(result); }).catch(error => { if (!controller.signal.aborted) setSettingsError(error.code || 'Não foi possível carregar as cores.'); });
    return () => controller.abort();
  }, [token, selectedOrganizationUid]);
  const open = uid => router.push(detailHref('/agenda', uid));
  const savePalette = event => {
    event.preventDefault();
    void action.run(async signal => {
      const body = agendaColorChanges(settings?.colors, palette);
      if (Object.keys(body.colors).length) await patchAgendaSettings({ token, organizationUid: selectedOrganizationUid, body, signal });
      return getAgendaSettings({ token, organizationUid: selectedOrganizationUid, signal });
    }, result => { setSettings(result); setPalette(null); });
  };
  return <>
    <PageBreadcrumb title="Agenda operacional" subTitle1="Operação" /><AgendaNavigation />
    <p>Acompanhe registros originados pela manutenção. Abra um registro para ajustar seus controles ou registrar uma análise.</p>
    <ListToolbar q={list.q} onChangeQ={list.setQ} />
    <div className="d-flex gap-2 mb-3"><Button variant="outline-secondary" onClick={list.refresh} disabled={list.loading}>Atualizar</Button><Button variant="outline-secondary" onClick={() => { action.clearError(); setPalette(structuredClone(settings?.colors || {})); }} disabled={!settings}>Cores da organização</Button></div>
    {settingsError && <Alert variant="warning">{settingsError}</Alert>}
    <Alert variant="info">O calendário exibe os {list.items.length} registros carregados{list.total != null ? ` de ${list.total}` : ''}. Use “Carregar mais” para incluir as próximas páginas. Datas são exibidas no fuso deste navegador.</Alert>
    {!list.error && <div className="card panel p-3 mb-3"><FullCalendar plugins={[dayGridPlugin, timeGridPlugin, listPlugin]} locale={ptBr} initialView="dayGridMonth" headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,listWeek' }} height="auto" editable={false} selectable={false} events={list.items.map(row => agendaEvent(row, settings)).filter(Boolean)} eventClick={info => open(info.event.id)} /></div>}
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} columns={[
      { key: 'title', label: 'Registro', render: row => <Button variant="link" onClick={() => open(row.uid)}>{row.title || row.uid}</Button> },
      { key: 'source_state', label: 'Situação na origem' }, { key: 'priority', label: 'Prioridade', render: row => PRIORITIES[row.priority] || row.priority },
      { key: 'due_at', label: 'Prazo', render: row => row.due_at ? new Date(row.due_at).toLocaleString('pt-BR') : 'Sem prazo' },
      { key: 'terminal', label: 'Encerrado', render: row => row.terminal ? 'Sim' : 'Não' }
    ]} />
    {palette && <FormModal show title="Cores da organização" submitting={action.busy} error={action.error} onSubmit={savePalette} onHide={() => { if (!action.busy) setPalette(null); }}><fieldset disabled={action.busy}>{Object.entries(palette).map(([group, colors]) => <div key={group}><h6>{{ priorities: 'Prioridades', states: 'Situações', controls: 'Controles' }[group] || group}</h6>{Object.entries(colors).map(([key, value]) => <label key={key} className="d-flex justify-content-between mb-2">{PRIORITIES[key] || key}<input type="color" aria-label={`Cor ${key}`} value={value} onChange={event => setPalette(previous => ({ ...previous, [group]: { ...previous[group], [key]: event.target.value } }))} /></label>)}</div>)}</fieldset></FormModal>}
  </>;
}
