<?php
/**
 * Access element
 *
 * @package     Joomla.Plugin
 * @subpackage  Fabrik.element.access
 * @copyright   Copyright (C) 2005-2013 fabrikar.com - All rights reserved.
 * @license     GNU/GPL http://www.gnu.org/copyleft/gpl.html
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

/**
 * Access element
 *
 * @package     Joomla.Plugin
 * @subpackage  Fabrik.element.access
 * @since       3.0
 */

class PlgFabrik_ElementAccess extends PlgFabrik_Element
{
	/**
	 * If the element 'Include in search all' option is set to 'default' then this states if the
	 * element should be ignored from search all.
	 * @var bool  True, ignore in extended search all.
	 */
	protected $ignoreSearchAllDefault = true;

	/**
	 * Manipulates posted form data for insertion into database
	 *
	 * @param   mixed  $val   this elements posted form data
	 * @param   array  $data  posted form data
	 *
	 * @return  mixed
	 */

	public function storeDatabaseFormat($val, $data)
	{
		// $$$ hugh - nope!
		// return $val[0];
		return $val;
	}

	/**
	 * Draws the html form element
	 *
	 * @param   array  $data           to pre-populate element with
	 * @param   int    $repeatCounter  repeat group counter
	 *
	 * @return  string	elements html
	 */

	public function render($data, $repeatCounter = 0)
	{
		$name = $this->getHTMLName($repeatCounter);
		$id = $this->getHTMLId($repeatCounter);

		$arSelected = array('');

		if (isset($data[$name]))
		{
			if (!is_array($data[$name]))
			{
				$arSelected = explode(',', $data[$name]);
			}
			else
			{
				$arSelected = $data[$name];
			}
		}

		if (!$this->isEditable())
		{
			$row = new stdClass;

			return $this->renderListData($arSelected[0], $row);
		}

		$layout = $this->getLayout('form');
		$displayData = new stdClass;
		$displayData->id = $id;
		$displayData->name = $name;
		$displayData->options = $this->getOpts();
		$displayData->selected =  $arSelected[0];

		return $layout->render($displayData);
	}

	/**
	 * Get list dropdown options
	 *
	 * @param   bool  $allowAll  add an show all option
	 *
	 * @return  array
	 */

	private function getOpts($allowAll = true)
	{
		$db = JFactory::getDbo();
		$db
			->setQuery(
				'SELECT a.id AS value, a.title AS text, COUNT(DISTINCT b.id) AS level' . ' FROM #__usergroups AS a'
					. ' LEFT JOIN `#__usergroups` AS b ON a.lft > b.lft AND a.rgt < b.rgt' . ' GROUP BY a.id' . ' ORDER BY a.lft ASC');
		$options = $db->loadObjectList();

		for ($i = 0, $n = count($options); $i < $n; $i++)
		{
			$options[$i]->text = str_repeat('- ', $options[$i]->level) . $options[$i]->text;
		}

		// If all user groups is allowed, push it into the array.
		if ($allowAll)
		{
			// If in front end we need to load the admin language..
			$lang = JFactory::getLanguage();
			$lang->load('joomla', JPATH_ADMINISTRATOR, null, false, false);

			array_unshift($options, JHtml::_('select.option', '', FText::_('JOPTION_ACCESS_SHOW_ALL_GROUPS')));
		}

		return $options;
	}

	/**
	 * Shows the data formatted for the list view
	 *
	 * @param   string    $data      elements data
	 * @param   stdClass  &$thisRow  all the data in the lists current row
	 *
	 * @return  string	formatted value
	 */

	public function renderListData($data, stdClass &$thisRow)
	{
		$options = $this->getOpts();
		$text = '';

		if ((string) $data !== '')
		{
			foreach ($options as $o)
			{
				if ($o->value == $data)
				{
					$text = JString::ltrim(str_replace('-', '', $o->text));
				}
			}
		}

		$layoutData = new stdClass;
		$layoutData->text = $text;

		return parent::renderListData($layoutData, $thisRow);
	}

	/**
	 * Get database field description
	 *
	 * @return  string  db field type
	 */

	public function getFieldDescription()
	{
		if ($this->encryptMe())
		{
			return 'BLOB';
		}

		return "INT(3)";
	}

	/**
	 * Returns javascript which creates an instance of the class defined in formJavascriptClass()
	 *
	 * @param   int  $repeatCounter  Repeat group counter
	 *
	 * @return  array
	 */

	public function elementJavascript($repeatCounter)
	{
		$id = $this->getHTMLId($repeatCounter);
		$opts = $this->getElementJSOptions($repeatCounter);

		return array('FbAccess', $id, $opts);
	}
}
