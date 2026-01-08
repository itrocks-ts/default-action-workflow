import { setAction }          from '@itrocks/action'
import { setActionCss }       from '@itrocks/action'
import { setActionTemplates } from '@itrocks/action'

export function build()
{
	setActionCss(
		{ file: '/@itrocks/(action)/css/action.css' }
	)
	setActionTemplates(
		{ file: '/@itrocks/action/cjs/selectionAction.html', need: 'object' },
		{ file: '/@itrocks/action/cjs/action.html' }
	)
	setAction('edit',   'delete', { target: '#notification:prepend' })
	setAction('login',  'forgot-password')
	setAction('login',  'signup', { caption: 'Sign up' })
	setAction('list',   'new')
	setAction('list',   'delete', { need: 'object', target: '#notification:prepend' })
	setAction('output', 'edit')
	setAction('output', 'print', { target: '_blank' } )
	setAction('output', 'delete', { target: '#notification:prepend' })
}
